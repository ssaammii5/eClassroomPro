using eClassroomPro.Application.DTOs.Auth;
using eClassroomPro.Application.Exceptions;
using eClassroomPro.Application.Interfaces;
using eClassroomPro.Application.Options;
using eClassroomPro.Application.Services;
using eClassroomPro.Domain.Entities;
using eClassroomPro.Domain.Enums;
using FluentAssertions;
using Moq;

namespace eClassroomPro.Application.UnitTests.Services;

public class AuthServiceTests
{
    private readonly Mock<IUserRepository> _userRepository = new();
    private readonly Mock<IPasswordHasher> _passwordHasher = new();
    private readonly Mock<ITokenService> _tokenService = new();
    private readonly Mock<IRefreshTokenRepository> _refreshTokenRepository = new();
    private readonly Mock<IDateTimeProvider> _dateTimeProvider = new();
    private readonly Mock<IUnitOfWork> _unitOfWork = new();

    private readonly DateTime _utcNow = new(2026, 8, 8, 12, 0, 0, DateTimeKind.Utc);

    private readonly JwtSettings _jwtSettings = new()
    {
        Secret = "unit-test-secret-unit-test-secret-unit-test-secret-unit-test-secret",
        Issuer = "eClassroomPro.API",
        Audience = "eClassroomPro.Client",
        ExpiresMinutes = 15,
        RefreshTokenExpirationDays = 7
    };

    private readonly AuthService _authService;

    public AuthServiceTests()
    {
        _dateTimeProvider.Setup(x => x.UtcNow).Returns(_utcNow);
        _unitOfWork.Setup(x => x.SaveChangesAsync(It.IsAny<CancellationToken>())).ReturnsAsync(1);

        _authService = new AuthService(
            _userRepository.Object,
            _passwordHasher.Object,
            _tokenService.Object,
            _refreshTokenRepository.Object,
            _dateTimeProvider.Object,
            _unitOfWork.Object,
            _jwtSettings);
    }

    private static User ActiveUser(int id = 1) => new()
    {
        Id = id,
        Name = "Demo Student",
        Email = "student@eclassroompro.com",
        PasswordHash = "hashed-password",
        Role = Role.Student,
        IsActive = true
    };

    /* ---------------- Login ---------------- */

    [Fact]
    public async Task Login_ValidCredentials_IssuesTokens()
    {
        var user = ActiveUser();
        _userRepository
            .Setup(x => x.GetByEmailAsync(user.Email, It.IsAny<CancellationToken>()))
            .ReturnsAsync(user);
        _passwordHasher.Setup(x => x.Verify("Student@123", user.PasswordHash)).Returns(true);
        _tokenService.Setup(x => x.CreateAccessToken(user)).Returns(("access-token", _utcNow.AddMinutes(15)));
        _tokenService.Setup(x => x.CreateRefreshToken()).Returns("raw-refresh-token");
        _tokenService.Setup(x => x.HashRefreshToken("raw-refresh-token")).Returns("refresh-hash");

        var result = await _authService.LoginAsync(
            new LoginRequestDto { Email = user.Email, Password = "Student@123" });

        result.AccessToken.Should().Be("access-token");
        result.RefreshToken.Should().Be("raw-refresh-token");
        result.Email.Should().Be(user.Email);
        result.Role.Should().Be("Student");

        _refreshTokenRepository.Verify(
            x => x.AddAsync(
                It.Is<RefreshToken>(t => t.UserId == user.Id && t.TokenHash == "refresh-hash"),
                It.IsAny<CancellationToken>()),
            Times.Once);
    }

    [Fact]
    public async Task Login_InvalidPassword_ThrowsUnauthorized()
    {
        var user = ActiveUser();
        _userRepository
            .Setup(x => x.GetByEmailAsync(user.Email, It.IsAny<CancellationToken>()))
            .ReturnsAsync(user);
        _passwordHasher.Setup(x => x.Verify("wrong", user.PasswordHash)).Returns(false);

        Func<Task> act = async () =>
            await _authService.LoginAsync(new LoginRequestDto { Email = user.Email, Password = "wrong" });

        await act.Should().ThrowAsync<UnauthorizedAccessException>()
            .WithMessage("Invalid email or password.");
    }

    [Fact]
    public async Task Login_InactiveUser_ThrowsUnauthorized()
    {
        var user = ActiveUser();
        user.IsActive = false;
        _userRepository
            .Setup(x => x.GetByEmailAsync(user.Email, It.IsAny<CancellationToken>()))
            .ReturnsAsync(user);
        _passwordHasher.Setup(x => x.Verify("Student@123", user.PasswordHash)).Returns(true);

        Func<Task> act = async () =>
            await _authService.LoginAsync(new LoginRequestDto { Email = user.Email, Password = "Student@123" });

        await act.Should().ThrowAsync<UnauthorizedAccessException>()
            .WithMessage("Your account is disabled.");
    }

    /* ---------------- Refresh-token flow ---------------- */

    private RefreshToken ValidStoredToken(User user) => new()
    {
        Id = 10,
        UserId = user.Id,
        User = user,
        TokenHash = "stored-hash",
        ExpiresAtUtc = _utcNow.AddDays(7),
        RevokedAtUtc = null
    };

    [Fact]
    public async Task Refresh_ValidToken_RotatesAndReturnsNewTokens()
    {
        var user = ActiveUser();
        var stored = ValidStoredToken(user);

        _tokenService.Setup(x => x.HashRefreshToken("incoming-refresh")).Returns("stored-hash");
        _refreshTokenRepository
            .Setup(x => x.GetByTokenHashAsync("stored-hash", It.IsAny<CancellationToken>()))
            .ReturnsAsync(stored);

        _tokenService.Setup(x => x.CreateRefreshToken()).Returns("new-raw-refresh");
        _tokenService.Setup(x => x.HashRefreshToken("new-raw-refresh")).Returns("new-hash");
        _tokenService.Setup(x => x.CreateAccessToken(user)).Returns(("new-access-token", _utcNow.AddMinutes(15)));

        var result = await _authService.RefreshAsync(
            new RefreshRequestDto { RefreshToken = "incoming-refresh" });

        // New tokens returned.
        result.AccessToken.Should().Be("new-access-token");
        result.RefreshToken.Should().Be("new-raw-refresh");

        // Old token revoked and linked to its replacement.
        stored.RevokedAtUtc.Should().Be(_utcNow);
        stored.ReplacedByTokenHash.Should().Be("new-hash");

        // New token persisted.
        _refreshTokenRepository.Verify(
            x => x.AddAsync(
                It.Is<RefreshToken>(t => t.UserId == user.Id && t.TokenHash == "new-hash"),
                It.IsAny<CancellationToken>()),
            Times.Once);

        _unitOfWork.Verify(x => x.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task Refresh_UnknownToken_ThrowsUnauthorized()
    {
        _tokenService.Setup(x => x.HashRefreshToken("unknown")).Returns("missing-hash");
        _refreshTokenRepository
            .Setup(x => x.GetByTokenHashAsync("missing-hash", It.IsAny<CancellationToken>()))
            .ReturnsAsync((RefreshToken?)null);

        Func<Task> act = async () =>
            await _authService.RefreshAsync(new RefreshRequestDto { RefreshToken = "unknown" });

        await act.Should().ThrowAsync<UnauthorizedAccessException>()
            .WithMessage("Invalid refresh token.");
    }

    [Fact]
    public async Task Refresh_ExpiredToken_ThrowsUnauthorized()
    {
        var user = ActiveUser();
        var stored = ValidStoredToken(user);
        stored.ExpiresAtUtc = _utcNow.AddSeconds(-1); // already expired

        _tokenService.Setup(x => x.HashRefreshToken("expired")).Returns("stored-hash");
        _refreshTokenRepository
            .Setup(x => x.GetByTokenHashAsync("stored-hash", It.IsAny<CancellationToken>()))
            .ReturnsAsync(stored);

        Func<Task> act = async () =>
            await _authService.RefreshAsync(new RefreshRequestDto { RefreshToken = "expired" });

        await act.Should().ThrowAsync<UnauthorizedAccessException>()
            .WithMessage("Invalid refresh token.");
    }

    [Fact]
    public async Task Refresh_RevokedToken_ThrowsUnauthorized()
    {
        var user = ActiveUser();
        var stored = ValidStoredToken(user);
        stored.RevokedAtUtc = _utcNow.AddMinutes(-5); // already revoked

        _tokenService.Setup(x => x.HashRefreshToken("revoked")).Returns("stored-hash");
        _refreshTokenRepository
            .Setup(x => x.GetByTokenHashAsync("stored-hash", It.IsAny<CancellationToken>()))
            .ReturnsAsync(stored);

        Func<Task> act = async () =>
            await _authService.RefreshAsync(new RefreshRequestDto { RefreshToken = "revoked" });

        await act.Should().ThrowAsync<UnauthorizedAccessException>()
            .WithMessage("Invalid refresh token.");
    }

    [Fact]
    public async Task Refresh_DisabledUser_ThrowsUnauthorized()
    {
        var user = ActiveUser();
        user.IsActive = false;
        var stored = ValidStoredToken(user);

        _tokenService.Setup(x => x.HashRefreshToken("incoming")).Returns("stored-hash");
        _refreshTokenRepository
            .Setup(x => x.GetByTokenHashAsync("stored-hash", It.IsAny<CancellationToken>()))
            .ReturnsAsync(stored);

        Func<Task> act = async () =>
            await _authService.RefreshAsync(new RefreshRequestDto { RefreshToken = "incoming" });

        await act.Should().ThrowAsync<UnauthorizedAccessException>()
            .WithMessage("User account is disabled.");
    }
}
using eClassroomPro.Application.DTOs.Auth;
using eClassroomPro.Application.Exceptions;
using eClassroomPro.Application.Interfaces;
using eClassroomPro.Application.Options;
using eClassroomPro.Domain.Entities;

namespace eClassroomPro.Application.Services;

public class AuthService
{
    private readonly IUserRepository _userRepository;
    private readonly IPasswordHasher _passwordHasher;
    private readonly ITokenService _tokenService;
    private readonly IRefreshTokenRepository _refreshTokenRepository;
    private readonly IDateTimeProvider _dateTimeProvider;
    private readonly IUnitOfWork _unitOfWork;
    private readonly JwtSettings _jwtSettings;

    public AuthService(
        IUserRepository userRepository,
        IPasswordHasher passwordHasher,
        ITokenService tokenService,
        IRefreshTokenRepository refreshTokenRepository,
        IDateTimeProvider dateTimeProvider,
        IUnitOfWork unitOfWork,
        JwtSettings jwtSettings)
    {
        _userRepository = userRepository;
        _passwordHasher = passwordHasher;
        _tokenService = tokenService;
        _refreshTokenRepository = refreshTokenRepository;
        _dateTimeProvider = dateTimeProvider;
        _unitOfWork = unitOfWork;
        _jwtSettings = jwtSettings;
    }

    public async Task<LoginResponseDto> LoginAsync(
        LoginRequestDto request,
        CancellationToken cancellationToken = default)
    {
        var email = request.Email.Trim().ToLowerInvariant();

        var user = await _userRepository.GetByEmailAsync(email, cancellationToken);

        if (user is null || !_passwordHasher.Verify(request.Password, user.PasswordHash))
        {
            throw new UnauthorizedAccessException("Invalid email or password.");
        }

        if (!user.IsActive)
        {
            throw new UnauthorizedAccessException("Your account is disabled.");
        }

        return await IssueTokensAsync(user, cancellationToken);
    }

    public async Task<LoginResponseDto> RefreshAsync(
        RefreshRequestDto request,
        CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(request.RefreshToken))
        {
            throw new UnauthorizedAccessException("Refresh token is required.");
        }

        var refreshTokenHash = _tokenService.HashRefreshToken(request.RefreshToken);

        var storedRefreshToken = await _refreshTokenRepository.GetByTokenHashAsync(
            refreshTokenHash,
            cancellationToken);

        var utcNow = _dateTimeProvider.UtcNow;

        if (storedRefreshToken is null || !storedRefreshToken.IsActive(utcNow))
        {
            throw new UnauthorizedAccessException("Invalid refresh token.");
        }

        if (storedRefreshToken.User is null || !storedRefreshToken.User.IsActive)
        {
            throw new UnauthorizedAccessException("User account is disabled.");
        }

        var newRawRefreshToken = _tokenService.CreateRefreshToken();
        var newRefreshTokenHash = _tokenService.HashRefreshToken(newRawRefreshToken);

        storedRefreshToken.RevokedAtUtc = utcNow;
        storedRefreshToken.ReplacedByTokenHash = newRefreshTokenHash;

        var newRefreshToken = new RefreshToken
        {
            UserId = storedRefreshToken.UserId,
            TokenHash = newRefreshTokenHash,
            ExpiresAtUtc = utcNow.AddDays(_jwtSettings.RefreshTokenExpirationDays)
        };

        await _refreshTokenRepository.AddAsync(newRefreshToken, cancellationToken);

        var (accessToken, accessTokenExpiresAtUtc) = _tokenService.CreateAccessToken(storedRefreshToken.User);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return new LoginResponseDto
        {
            Token = accessToken,
            AccessToken = accessToken,
            AccessTokenExpiresAtUtc = accessTokenExpiresAtUtc,
            RefreshToken = newRawRefreshToken,
            Email = storedRefreshToken.User.Email,
            Name = storedRefreshToken.User.Name,
            Role = storedRefreshToken.User.Role.ToString()
        };
    }

    public async Task RevokeAllForUserAsync(
        int userId,
        CancellationToken cancellationToken = default)
    {
        await _refreshTokenRepository.RevokeAllForUserAsync(
            userId,
            _dateTimeProvider.UtcNow,
            cancellationToken);

        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }

    public async Task<MeResponseDto> GetMeAsync(
        int userId,
        CancellationToken cancellationToken = default)
    {
        var user = await _userRepository.GetByIdAsync(userId, cancellationToken)
            ?? throw new NotFoundException("User not found.");

        return new MeResponseDto
        {
            Id = user.Id,
            Name = user.Name,
            Email = user.Email,
            Role = user.Role.ToString()
        };
    }

    private async Task<LoginResponseDto> IssueTokensAsync(
        User user,
        CancellationToken cancellationToken)
    {
        var (accessToken, accessTokenExpiresAtUtc) = _tokenService.CreateAccessToken(user);

        var rawRefreshToken = _tokenService.CreateRefreshToken();
        var refreshTokenHash = _tokenService.HashRefreshToken(rawRefreshToken);

        var refreshToken = new RefreshToken
        {
            UserId = user.Id,
            TokenHash = refreshTokenHash,
            ExpiresAtUtc = _dateTimeProvider.UtcNow.AddDays(_jwtSettings.RefreshTokenExpirationDays)
        };

        await _refreshTokenRepository.AddAsync(refreshToken, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return new LoginResponseDto
        {
            Token = accessToken,
            AccessToken = accessToken,
            AccessTokenExpiresAtUtc = accessTokenExpiresAtUtc,
            RefreshToken = rawRefreshToken,
            Email = user.Email,
            Name = user.Name,
            Role = user.Role.ToString()
        };
    }
}
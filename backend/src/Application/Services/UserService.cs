using eClassroomPro.Application.DTOs.Users;
using eClassroomPro.Application.Exceptions;
using eClassroomPro.Application.Interfaces;
using eClassroomPro.Domain.Entities;
using eClassroomPro.Domain.Enums;

namespace eClassroomPro.Application.Services;

public class UserService
{
    private readonly IUserRepository _userRepository;
    private readonly IPasswordHasher _passwordHasher;
    private readonly ICurrentUserService _currentUserService;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IRefreshTokenRepository _refreshTokenRepository;
    private readonly IDateTimeProvider _dateTimeProvider;

    public UserService(
        IUserRepository userRepository,
        IPasswordHasher passwordHasher,
        ICurrentUserService currentUserService,
        IUnitOfWork unitOfWork,
        IRefreshTokenRepository refreshTokenRepository,
        IDateTimeProvider dateTimeProvider)
    {
        _userRepository = userRepository;
        _passwordHasher = passwordHasher;
        _currentUserService = currentUserService;
        _unitOfWork = unitOfWork;
        _refreshTokenRepository = refreshTokenRepository;
        _dateTimeProvider = dateTimeProvider;
    }

    public async Task<IReadOnlyList<UserDto>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        EnsureAdmin();

        var users = await _userRepository.GetAllAsync(cancellationToken);

        return users.Select(ToDto).ToList();
    }

    public async Task<UserDto> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        EnsureAdmin();

        var user = await _userRepository.GetByIdAsync(id, cancellationToken)
            ?? throw new NotFoundException("User not found.");

        return ToDto(user);
    }

    public async Task<UserDto> CreateAsync(CreateUserDto dto, CancellationToken cancellationToken = default)
    {
        EnsureAdmin();

        if (string.IsNullOrWhiteSpace(dto.Name))
        {
            throw new ValidationException("Name is required.");
        }

        if (string.IsNullOrWhiteSpace(dto.Email))
        {
            throw new ValidationException("Email is required.");
        }

        if (string.IsNullOrWhiteSpace(dto.Password) || dto.Password.Length < 8)
        {
            throw new ValidationException("Password must contain at least 8 characters.");
        }

        var email = dto.Email.Trim().ToLowerInvariant();

        if (await _userRepository.ExistsByEmailAsync(email, cancellationToken))
        {
            throw new BusinessException("A user with this email already exists.");
        }

        var user = new User
        {
            Name = dto.Name.Trim(),
            Email = email,
            PasswordHash = _passwordHasher.Hash(dto.Password),
            Role = dto.Role,
            IsActive = true
        };

        await _userRepository.AddAsync(user, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return ToDto(user);
    }

    public async Task UpdateAsync(int id, UpdateUserDto dto, CancellationToken cancellationToken = default)
    {
        EnsureAdmin();

        var user = await _userRepository.GetByIdAsync(id, cancellationToken)
            ?? throw new NotFoundException("User not found.");

        var email = dto.Email.Trim().ToLowerInvariant();

        if (user.Email != email && await _userRepository.ExistsByEmailAsync(email, cancellationToken))
        {
            throw new BusinessException("A user with this email already exists.");
        }

        var passwordChanged = !string.IsNullOrWhiteSpace(dto.Password);
        var roleChanged = user.Role != dto.Role;
        var activeChanged = user.IsActive != dto.IsActive;

        user.Name = dto.Name.Trim();
        user.Email = email;
        user.Role = dto.Role;
        user.IsActive = dto.IsActive;
        user.UpdatedAtUtc = DateTime.UtcNow;

        if (passwordChanged)
        {
            if (dto.Password!.Length < 8)
            {
                throw new ValidationException("Password must contain at least 8 characters.");
            }

            user.PasswordHash = _passwordHasher.Hash(dto.Password);
        }

        if (passwordChanged || roleChanged || activeChanged)
        {
            await _refreshTokenRepository.RevokeAllForUserAsync(
                user.Id,
                _dateTimeProvider.UtcNow,
                cancellationToken);
        }

        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }

    public async Task DeleteAsync(int id, CancellationToken cancellationToken = default)
    {
        EnsureAdmin();

        if (_currentUserService.UserId == id)
        {
            throw new BusinessException("You cannot delete your own account.");
        }

        var user = await _userRepository.GetByIdAsync(id, cancellationToken)
            ?? throw new NotFoundException("User not found.");

        await _refreshTokenRepository.RevokeAllForUserAsync(
            user.Id,
            _dateTimeProvider.UtcNow,
            cancellationToken);

        _userRepository.Remove(user);

        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }

    private void EnsureAdmin()
    {
        if (!_currentUserService.IsAdmin)
        {
            throw new ForbiddenAccessException("Only admins can manage users.");
        }
    }

    private static UserDto ToDto(User user)
    {
        return new UserDto
        {
            Id = user.Id,
            Name = user.Name,
            Email = user.Email,
            Role = user.Role,
            IsActive = user.IsActive,
            CreatedAtUtc = user.CreatedAtUtc
        };
    }
}
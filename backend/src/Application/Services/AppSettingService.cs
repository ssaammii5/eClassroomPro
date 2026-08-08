using eClassroomPro.Application.DTOs.AppSettings;
using eClassroomPro.Application.Exceptions;
using eClassroomPro.Application.Interfaces;
using eClassroomPro.Domain.Entities;

namespace eClassroomPro.Application.Services;

public class AppSettingService
{
    private readonly IAppSettingRepository _appSettingRepository;
    private readonly ICurrentUserService _currentUserService;
    private readonly IUnitOfWork _unitOfWork;

    public AppSettingService(
        IAppSettingRepository appSettingRepository,
        ICurrentUserService currentUserService,
        IUnitOfWork unitOfWork)
    {
        _appSettingRepository = appSettingRepository;
        _currentUserService = currentUserService;
        _unitOfWork = unitOfWork;
    }

    public async Task<IReadOnlyList<AppSettingDto>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        EnsureAdmin();

        var settings = await _appSettingRepository.GetAllAsync(cancellationToken);

        return settings
            .Select(x => new AppSettingDto
            {
                Key = x.Key,
                Value = x.Value
            })
            .ToList();
    }

    public async Task<AppSettingDto> UpsertAsync(UpsertAppSettingDto dto, CancellationToken cancellationToken = default)
    {
        EnsureAdmin();

        if (string.IsNullOrWhiteSpace(dto.Key))
        {
            throw new ValidationException("Setting key is required.");
        }

        var key = dto.Key.Trim();

        var setting = await _appSettingRepository.GetByKeyAsync(key, cancellationToken);

        if (setting is null)
        {
            setting = new AppSetting
            {
                Key = key,
                Value = dto.Value.Trim()
            };

            await _appSettingRepository.AddAsync(setting, cancellationToken);
        }
        else
        {
            setting.Value = dto.Value.Trim();
            setting.UpdatedAtUtc = DateTime.UtcNow;
            _appSettingRepository.Update(setting);
        }

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return new AppSettingDto
        {
            Key = setting.Key,
            Value = setting.Value
        };
    }

    private void EnsureAdmin()
    {
        if (!_currentUserService.IsAdmin)
        {
            throw new ForbiddenAccessException("Only admins can manage application settings.");
        }
    }
}
using eClassroomPro.Domain.Entities;

namespace eClassroomPro.Application.Interfaces;

public interface IAppSettingRepository
{
    Task<IReadOnlyList<AppSetting>> GetAllAsync(CancellationToken cancellationToken = default);

    Task<AppSetting?> GetByKeyAsync(string key, CancellationToken cancellationToken = default);

    Task AddAsync(AppSetting appSetting, CancellationToken cancellationToken = default);

    void Update(AppSetting appSetting);
}
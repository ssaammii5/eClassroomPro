using eClassroomPro.Application.Interfaces;
using eClassroomPro.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace eClassroomPro.Infrastructure.Persistence.Repositories;

public class AppSettingRepository : IAppSettingRepository
{
    private readonly ApplicationDbContext _context;

    public AppSettingRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IReadOnlyList<AppSetting>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await _context.AppSettings
            .AsNoTracking()
            .OrderBy(x => x.Key)
            .ToListAsync(cancellationToken);
    }

    public async Task<AppSetting?> GetByKeyAsync(string key, CancellationToken cancellationToken = default)
    {
        return await _context.AppSettings
            .FirstOrDefaultAsync(x => x.Key == key, cancellationToken);
    }

    public async Task AddAsync(AppSetting appSetting, CancellationToken cancellationToken = default)
    {
        await _context.AppSettings.AddAsync(appSetting, cancellationToken);
    }

    public void Update(AppSetting appSetting)
    {
        _context.AppSettings.Update(appSetting);
    }
}
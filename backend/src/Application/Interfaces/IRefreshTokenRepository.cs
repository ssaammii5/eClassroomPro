// backend/src/Application/Interfaces/IRefreshTokenRepository.cs
using eClassroomPro.Domain.Entities;

namespace eClassroomPro.Application.Interfaces;

public interface IRefreshTokenRepository
{
    Task<RefreshToken?> GetByTokenHashAsync(
        string tokenHash,
        CancellationToken cancellationToken = default);

    Task AddAsync(
        RefreshToken refreshToken,
        CancellationToken cancellationToken = default);

    Task RevokeAllForUserAsync(
        int userId,
        DateTime utcNow,
        CancellationToken cancellationToken = default);
}
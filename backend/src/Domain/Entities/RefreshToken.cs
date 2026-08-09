// backend/src/Domain/Entities/RefreshToken.cs
using eClassroomPro.Domain.Common;

namespace eClassroomPro.Domain.Entities;

public class RefreshToken : BaseEntity
{
    public int UserId { get; set; }

    public User? User { get; set; }

    public string TokenHash { get; set; } = string.Empty;

    public DateTime ExpiresAtUtc { get; set; }

    public DateTime? RevokedAtUtc { get; set; }

    public string? ReplacedByTokenHash { get; set; }

    public bool IsActive(DateTime utcNow)
    {
        return RevokedAtUtc is null && ExpiresAtUtc > utcNow;
    }
}
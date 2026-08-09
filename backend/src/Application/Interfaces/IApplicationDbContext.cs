using eClassroomPro.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace eClassroomPro.Application.Interfaces;

public interface IApplicationDbContext
{
    DbSet<User> Users { get; }

    DbSet<Course> Courses { get; }

    DbSet<Enrollment> Enrollments { get; }

    DbSet<Assignment> Assignments { get; }

    DbSet<Submission> Submissions { get; }

    DbSet<AppSetting> AppSettings { get; }

    DbSet<RefreshToken> RefreshTokens { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
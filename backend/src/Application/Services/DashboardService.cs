using eClassroomPro.Application.DTOs.Dashboard;
using eClassroomPro.Application.Exceptions;
using eClassroomPro.Application.Interfaces;
using eClassroomPro.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace eClassroomPro.Application.Services;

public class DashboardService
{
    private readonly IApplicationDbContext _db;
    private readonly ICurrentUserService _currentUserService;

    public DashboardService(
        IApplicationDbContext db,
        ICurrentUserService currentUserService)
    {
        _db = db;
        _currentUserService = currentUserService;
    }

    public async Task<DashboardStatsDto> GetStatsAsync(CancellationToken cancellationToken = default)
    {
        EnsureAdmin();

        var totalUsers = await _db.Users.CountAsync(cancellationToken);
        var activeUsers = await _db.Users.CountAsync(u => u.IsActive, cancellationToken);
        var totalTeachers = await _db.Users.CountAsync(u => u.Role == Role.Teacher, cancellationToken);
        var totalStudents = await _db.Users.CountAsync(u => u.Role == Role.Student, cancellationToken);

        var totalCourses = await _db.Courses.CountAsync(cancellationToken);
        // Course does not track IsActive yet; treated as all-active until the Courses phase.
        var activeCourses = totalCourses;

        var totalAssignments = await _db.Assignments.CountAsync(cancellationToken);
        var publishedAssignments = await _db.Assignments
            .CountAsync(a => a.Status == AssignmentStatus.Published, cancellationToken);

        var totalSubmissions = await _db.Submissions.CountAsync(cancellationToken);
        var gradedSubmissions = await _db.Submissions
            .CountAsync(s => s.Status == SubmissionStatus.Graded, cancellationToken);
        var pendingSubmissions = await _db.Submissions
            .CountAsync(s => s.Status == SubmissionStatus.Submitted, cancellationToken);

        return new DashboardStatsDto
        {
            TotalUsers = totalUsers,
            ActiveUsers = activeUsers,
            TotalTeachers = totalTeachers,
            TotalStudents = totalStudents,
            TotalCourses = totalCourses,
            ActiveCourses = activeCourses,
            TotalAssignments = totalAssignments,
            PublishedAssignments = publishedAssignments,
            TotalSubmissions = totalSubmissions,
            GradedSubmissions = gradedSubmissions,
            PendingSubmissions = pendingSubmissions
        };
    }

    private void EnsureAdmin()
    {
        if (!_currentUserService.IsAdmin)
        {
            throw new ForbiddenAccessException("Only admins can view dashboard statistics.");
        }
    }
}
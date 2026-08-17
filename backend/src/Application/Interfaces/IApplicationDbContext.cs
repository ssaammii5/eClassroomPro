// backend/src/Application/Interfaces/IApplicationDbContext.cs
using eClassroomPro.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace eClassroomPro.Application.Interfaces;

public interface IApplicationDbContext
{
    DbSet<User> Users { get; }
    DbSet<Course> Courses { get; }
    DbSet<CourseTeacher> CourseTeachers { get; }
    DbSet<Enrollment> Enrollments { get; }
    DbSet<Assignment> Assignments { get; }
    DbSet<AssignmentAttachment> AssignmentAttachments { get; }
    DbSet<Submission> Submissions { get; }
    DbSet<SubmissionAttachment> SubmissionAttachments { get; }
    DbSet<SubmissionActivity> SubmissionActivities { get; }
    DbSet<AppSetting> AppSettings { get; }
    DbSet<RefreshToken> RefreshTokens { get; }
    DbSet<AcademicProgram> AcademicPrograms { get; }
    DbSet<AcademicDepartment> AcademicDepartments { get; }
    DbSet<AcademicSemester> AcademicSemesters { get; }
    DbSet<StudentDetails> StudentDetails { get; }
    DbSet<TeacherDetails> TeacherDetails { get; }
    DbSet<Announcement> Announcements { get; }
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
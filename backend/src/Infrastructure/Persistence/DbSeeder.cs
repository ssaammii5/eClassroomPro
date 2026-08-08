using eClassroomPro.Domain.Entities;
using eClassroomPro.Domain.Enums;
using eClassroomPro.Infrastructure.Authentication;
using Microsoft.EntityFrameworkCore;

namespace eClassroomPro.Infrastructure.Persistence;

public static class DbSeeder
{
    public static async Task SeedAsync(ApplicationDbContext context)
    {
        if (await context.Users.AnyAsync())
        {
            return;
        }

        var passwordHasher = new PasswordHasher();

        var admin = new User
        {
            Name = "System Admin",
            Email = "admin@eclassroompro.com",
            PasswordHash = passwordHasher.Hash("Admin@123"),
            Role = Role.Admin,
            IsActive = true
        };

        var teacher = new User
        {
            Name = "Demo Teacher",
            Email = "teacher@eclassroompro.com",
            PasswordHash = passwordHasher.Hash("Teacher@123"),
            Role = Role.Teacher,
            IsActive = true
        };

        var student = new User
        {
            Name = "Demo Student",
            Email = "student@eclassroompro.com",
            PasswordHash = passwordHasher.Hash("Student@123"),
            Role = Role.Student,
            IsActive = true
        };

        context.Users.AddRange(admin, teacher, student);
        await context.SaveChangesAsync();

        var course = new Course
        {
            Name = "Class 10",
            Subject = "Mathematics",
            TeacherId = teacher.Id
        };

        context.Courses.Add(course);
        await context.SaveChangesAsync();

        var enrollment = new Enrollment
        {
            CourseId = course.Id,
            UserId = student.Id
        };

        context.Enrollments.Add(enrollment);
        await context.SaveChangesAsync();

        var assignment = new Assignment
        {
            Title = "Algebra Homework",
            Description = "Solve chapter 1 exercises.",
            CourseId = course.Id,
            CreatedById = teacher.Id,
            DeadlineUtc = DateTime.UtcNow.AddDays(7),
            MaxMarks = 20,
            Status = AssignmentStatus.Published
        };

        context.Assignments.Add(assignment);
        await context.SaveChangesAsync();

        var submission = new Submission
        {
            AssignmentId = assignment.Id,
            StudentId = student.Id,
            Answer = "My initial answer.",
            Status = SubmissionStatus.Submitted,
            SubmittedAtUtc = DateTime.UtcNow
        };

        context.Submissions.Add(submission);

        var schoolNameSetting = new AppSetting
        {
            Key = "SchoolName",
            Value = "eClassroomPro School"
        };

        var lateSubmissionSetting = new AppSetting
        {
            Key = "AllowLateSubmissions",
            Value = "false"
        };

        context.AppSettings.AddRange(schoolNameSetting, lateSubmissionSetting);

        await context.SaveChangesAsync();
    }
}
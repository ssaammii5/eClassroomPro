using eClassroomPro.Domain.Entities;
using eClassroomPro.Domain.Enums;
using eClassroomPro.Infrastructure.Authentication;
using Microsoft.EntityFrameworkCore;

namespace eClassroomPro.Infrastructure.Persistence;

public static class DbSeeder
{
    public static async Task SeedAsync(ApplicationDbContext context)
    {
        // Phase 7: app settings are seeded idempotently on every startup so they
        // also populate databases that were created before this feature existed.
        await EnsureAppSettingsAsync(context);

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

        var teacherDetails = new TeacherDetails
        {
            UserId = teacher.Id,
            TeacherId = "FAC-1001",
            Designation = "Assistant Professor",
            Department = "Mathematics"
        };

        var studentDetails = new StudentDetails
        {
            UserId = student.Id,
            StudentId = "201-15-1001",
            RegNo = "1234567890",
            Department = "Mathematics",
            CurrentProgram = "Undergraduate",
            Session = "2021-2022",
            SemesterSession = "January-June/2022"
        };

        context.TeacherDetails.Add(teacherDetails);
        context.StudentDetails.Add(studentDetails);
        await context.SaveChangesAsync();

        var programs = new[]
        {
            new AcademicProgram { Name = "Undergraduate", Description = "Bachelor's degree programs (4 years)" },
            new AcademicProgram { Name = "Postgraduate", Description = "Master's degree programs (2 years)" },
            new AcademicProgram { Name = "Post Graduate Diploma", Description = "Postgraduate diploma programs (1 year)" },
            new AcademicProgram { Name = "M.Phil", Description = "Master of Philosophy research program" },
            new AcademicProgram { Name = "PhD", Description = "Doctoral research program" }
        };

        var departments = new[]
        {
            new AcademicDepartment { Name = "Computer Science and Engineering", Code = "CSE" },
            new AcademicDepartment { Name = "Electrical and Electronic Engineering", Code = "EEE" },
            new AcademicDepartment { Name = "Business Administration", Code = "BBA" },
            new AcademicDepartment { Name = "English", Code = "ENG" },
            new AcademicDepartment { Name = "Economics", Code = "ECO" },
            new AcademicDepartment { Name = "Law", Code = "LAW" },
            new AcademicDepartment { Name = "Mathematics", Code = "MTH" },
            new AcademicDepartment { Name = "Physics", Code = "PHY" },
            new AcademicDepartment { Name = "Chemistry", Code = "CHM" }
        };

        var semesters = new[]
        {
            new AcademicSemester { Name = "January-June/2023" },
            new AcademicSemester { Name = "July-December/2023" },
            new AcademicSemester { Name = "January-June/2024" },
            new AcademicSemester { Name = "July-December/2024" },
            new AcademicSemester { Name = "January-June/2025" },
            new AcademicSemester { Name = "July-December/2025" },
            new AcademicSemester { Name = "January-June/2026" },
            new AcademicSemester { Name = "July-December/2026" }
        };

        context.AcademicPrograms.AddRange(programs);
        context.AcademicDepartments.AddRange(departments);
        context.AcademicSemesters.AddRange(semesters);
        await context.SaveChangesAsync();

        var course = new Course
        {
            Name = "Class 10",
            Subject = "Mathematics",
            Program = "Undergraduate",
            Department = "MTH",
            Session = "January-June/2022",
            IsActive = true,
            TeacherId = teacher.Id
        };

        context.Courses.Add(course);
        await context.SaveChangesAsync();

        context.CourseTeachers.Add(new CourseTeacher
        {
            CourseId = course.Id,
            TeacherId = teacher.Id
        });

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
            Topic = "Algebra",
            Kind = AssignmentKind.Assignment,
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
        await context.SaveChangesAsync();
    }

    private static async Task EnsureAppSettingsAsync(ApplicationDbContext context)
    {
        var defaults = new (string Key, string Value, string Description, string Category)[]
        {
            ("site_name", "eClassroomPro", "The display name of the application", "General"),
            ("max_file_size_mb", "10", "Maximum file upload size in MB", "General"),
            ("allowed_file_types", "pdf,doc,docx,zip,txt", "Comma-separated list of allowed file types", "General"),

            ("email_notifications_enabled", "true", "Enable email notifications for assignments", "Notifications"),
            ("due_date_reminder_hours", "24", "Hours before deadline to send reminder", "Notifications"),
            ("grade_notification_enabled", "true", "Notify students when graded", "Notifications"),

            ("max_marks_default", "100", "Default maximum marks for assignments", "Grading"),
            ("allow_late_submission", "false", "Allow submissions after deadline", "Grading"),
            ("late_submission_penalty_percent", "10", "Percentage penalty for late submissions", "Grading"),

            ("session_timeout_minutes", "60", "Session timeout in minutes", "Security"),
            ("password_min_length", "8", "Minimum password length", "Security"),
            ("enable_two_factor_auth", "false", "Require 2FA for all users", "Security"),
        };

        foreach (var d in defaults)
        {
            var exists = await context.AppSettings.AnyAsync(x => x.Key == d.Key);
            if (!exists)
            {
                context.AppSettings.Add(new AppSetting
                {
                    Key = d.Key,
                    Value = d.Value,
                    Description = d.Description,
                    Category = d.Category
                });
            }
        }

        await context.SaveChangesAsync();
    }
}
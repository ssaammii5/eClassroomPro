using eClassroomPro.Domain.Entities;
using eClassroomPro.Domain.Enums;
using eClassroomPro.Infrastructure.Persistence;
using eClassroomPro.Infrastructure.Persistence.Repositories;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Testcontainers.PostgreSql;

namespace eClassroomPro.Infrastructure.IntegrationTests.Persistence;

public class AssignmentRepositoryTests : IAsyncLifetime
{
    private PostgreSqlContainer? _postgresContainer;

    private ApplicationDbContext _context = null!;

    public async Task InitializeAsync()
    {
        _postgresContainer = new PostgreSqlBuilder().Build();

        await _postgresContainer.StartAsync();

        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseNpgsql(_postgresContainer.GetConnectionString())
            .Options;

        _context = new ApplicationDbContext(options);

        await _context.Database.EnsureCreatedAsync();
    }

    public async Task DisposeAsync()
    {
        await _context.DisposeAsync();

        if (_postgresContainer is not null)
        {
            await _postgresContainer.DisposeAsync();
        }
    }

    [Fact]
    public async Task Can_Add_And_Get_Assignment()
    {
        var teacher = new User
        {
            Name = "Teacher",
            Email = "teacher@example.com",
            PasswordHash = "hashed-password",
            Role = Role.Teacher,
            IsActive = true
        };

        var student = new User
        {
            Name = "Student",
            Email = "student@example.com",
            PasswordHash = "hashed-password",
            Role = Role.Student,
            IsActive = true
        };

        _context.Users.AddRange(teacher, student);
        await _context.SaveChangesAsync();

        var course = new Course
        {
            Name = "Math Class",
            Subject = "Mathematics",
            TeacherId = teacher.Id
        };

        _context.Courses.Add(course);
        await _context.SaveChangesAsync();

        var assignment = new Assignment
        {
            Title = "Integration Test Assignment",
            Description = "Test description",
            CourseId = course.Id,
            CreatedById = teacher.Id,
            DeadlineUtc = DateTime.UtcNow.AddDays(1),
            MaxMarks = 10,
            Status = AssignmentStatus.Draft
        };

        var repository = new AssignmentRepository(_context);

        await repository.AddAsync(assignment);
        await _context.SaveChangesAsync();

        var fetched = await repository.GetByIdAsync(assignment.Id);

        fetched.Should().NotBeNull();
        fetched!.Title.Should().Be("Integration Test Assignment");
        fetched.Course.Should().NotBeNull();
        fetched.Course!.Name.Should().Be("Math Class");
    }
}
using eClassroomPro.Application.DTOs.Assignments;
using eClassroomPro.Application.Exceptions;
using eClassroomPro.Application.Interfaces;
using eClassroomPro.Application.Services;
using eClassroomPro.Domain.Entities;
using eClassroomPro.Domain.Enums;
using FluentAssertions;
using Moq;

namespace eClassroomPro.Application.UnitTests.Services;

public class AssignmentServiceTests
{
    private readonly Mock<IAssignmentRepository> _assignmentRepository = new();
    private readonly Mock<ICourseRepository> _courseRepository = new();
    private readonly Mock<ISubmissionRepository> _submissionRepository = new();
    private readonly Mock<ICurrentUserService> _currentUserService = new();
    private readonly Mock<IDateTimeProvider> _dateTimeProvider = new();
    private readonly Mock<IUnitOfWork> _unitOfWork = new();
    private readonly AssignmentService _assignmentService;
    private readonly DateTime _utcNow = new(2026, 8, 8, 12, 0, 0, DateTimeKind.Utc);

    public AssignmentServiceTests()
    {
        _dateTimeProvider.Setup(x => x.UtcNow).Returns(_utcNow);
        _assignmentService = new AssignmentService(
            _assignmentRepository.Object,
            _courseRepository.Object,
            _submissionRepository.Object,
            _currentUserService.Object,
            _dateTimeProvider.Object,
            _unitOfWork.Object);
    }

    [Fact]
    public async Task Create_Should_Throw_When_MaxMarks_Is_Zero()
    {
        _currentUserService.Setup(x => x.IsTeacher).Returns(true);
        _currentUserService.Setup(x => x.UserId).Returns(1);

        var dto = new CreateAssignmentDto
        {
            CourseId = 1,
            Title = "Math Homework",
            Description = "Solve chapter 1",
            DeadlineUtc = _utcNow.AddDays(1),
            MaxMarks = 0
        };

        Func<Task> act = async () => await _assignmentService.CreateAsync(dto);

        await act.Should().ThrowAsync<ValidationException>()
            .WithMessage("Maximum marks must be greater than zero.");
    }

    [Fact]
    public async Task Create_Should_Throw_When_Deadline_Is_In_Past()
    {
        _currentUserService.Setup(x => x.IsTeacher).Returns(true);
        _currentUserService.Setup(x => x.UserId).Returns(1);

        var dto = new CreateAssignmentDto
        {
            CourseId = 1,
            Title = "Math Homework",
            Description = "Solve chapter 1",
            DeadlineUtc = _utcNow.AddMinutes(-1),
            MaxMarks = 10
        };

        Func<Task> act = async () => await _assignmentService.CreateAsync(dto);

        await act.Should().ThrowAsync<BusinessException>()
            .WithMessage("Assignment deadline must be in the future.");
    }

    [Fact]
    public async Task Create_Should_Throw_When_Teacher_Does_Not_Teach_Course()
    {
        _currentUserService.Setup(x => x.IsTeacher).Returns(true);
        _currentUserService.Setup(x => x.UserId).Returns(1);

        var course = new Course
        {
            Id = 1,
            Name = "Math Class",
            Subject = "Mathematics",
            TeacherId = 2
        };

        _courseRepository
            .Setup(x => x.GetByIdAsync(1, It.IsAny<CancellationToken>()))
            .ReturnsAsync(course);

        var dto = new CreateAssignmentDto
        {
            CourseId = 1,
            Title = "Math Homework",
            Description = "Solve chapter 1",
            DeadlineUtc = _utcNow.AddDays(1),
            MaxMarks = 10
        };

        Func<Task> act = async () => await _assignmentService.CreateAsync(dto);

        await act.Should().ThrowAsync<ForbiddenAccessException>()
            .WithMessage("You can create assignments only for courses assigned to you.");
    }

    [Fact]
    public async Task Create_Should_Create_Draft_Assignment_When_Valid()
    {
        _currentUserService.Setup(x => x.IsTeacher).Returns(true);
        _currentUserService.Setup(x => x.UserId).Returns(1);

        var course = new Course
        {
            Id = 1,
            Name = "Math Class",
            Subject = "Mathematics",
            TeacherId = 1
        };

        _courseRepository
            .Setup(x => x.GetByIdAsync(1, It.IsAny<CancellationToken>()))
            .ReturnsAsync(course);

        _assignmentRepository
            .Setup(x => x.AddAsync(It.IsAny<Assignment>(), It.IsAny<CancellationToken>()))
            .Callback<Assignment, CancellationToken>((assignment, _) => assignment.Id = 10)
            .Returns(Task.CompletedTask);

        _unitOfWork
            .Setup(x => x.SaveChangesAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(1);

        var dto = new CreateAssignmentDto
        {
            CourseId = 1,
            Title = "Math Homework",
            Description = "Solve chapter 1",
            DeadlineUtc = _utcNow.AddDays(1),
            MaxMarks = 10
        };

        var result = await _assignmentService.CreateAsync(dto);

        result.Should().Be(10);

        _assignmentRepository.Verify(
            x => x.AddAsync(
                It.Is<Assignment>(a =>
                    a.Title == "Math Homework" &&
                    a.Status == AssignmentStatus.Draft &&
                    a.CreatedById == 1),
                It.IsAny<CancellationToken>()),
            Times.Once);
    }
}
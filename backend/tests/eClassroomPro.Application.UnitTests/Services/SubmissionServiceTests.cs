using eClassroomPro.Application.DTOs.Submissions;
using eClassroomPro.Application.Exceptions;
using eClassroomPro.Application.Interfaces;
using eClassroomPro.Application.Services;
using eClassroomPro.Domain.Entities;
using eClassroomPro.Domain.Enums;
using FluentAssertions;
using Moq;

namespace eClassroomPro.Application.UnitTests.Services;

public class SubmissionServiceTests
{
    private readonly Mock<ISubmissionRepository> _submissionRepository = new();
    private readonly Mock<IAssignmentRepository> _assignmentRepository = new();
    private readonly Mock<ICourseRepository> _courseRepository = new();
    private readonly Mock<ICurrentUserService> _currentUserService = new();
    private readonly Mock<IDateTimeProvider> _dateTimeProvider = new();
    private readonly Mock<IUnitOfWork> _unitOfWork = new();
    private readonly Mock<IApplicationDbContext> _db = new();
    private readonly SubmissionService _submissionService;
    private readonly DateTime _utcNow = new(2026, 8, 8, 12, 0, 0, DateTimeKind.Utc);

    public SubmissionServiceTests()
    {
        _dateTimeProvider.Setup(x => x.UtcNow).Returns(_utcNow);
        _submissionService = new SubmissionService(
            _submissionRepository.Object,
            _assignmentRepository.Object,
            _courseRepository.Object,
            _currentUserService.Object,
            _dateTimeProvider.Object,
            _unitOfWork.Object,
            _db.Object);
    }

    [Fact]
    public async Task Submit_Should_Throw_When_Assignment_Is_Not_Published()
    {
        _currentUserService.Setup(x => x.IsStudent).Returns(true);
        _currentUserService.Setup(x => x.UserId).Returns(10);

        var assignment = new Assignment
        {
            Id = 1,
            CourseId = 1,
            Status = AssignmentStatus.Draft,
            DeadlineUtc = _utcNow.AddDays(1)
        };

        _assignmentRepository
            .Setup(x => x.GetByIdAsync(1, It.IsAny<CancellationToken>()))
            .ReturnsAsync(assignment);

        var dto = new SubmitAssignmentDto
        {
            AssignmentId = 1,
            Answer = "My answer"
        };

        Func<Task> act = async () => await _submissionService.SubmitAsync(dto);

        await act.Should().ThrowAsync<BusinessException>()
            .WithMessage("Assignment is not available for submission.");
    }

    [Fact]
    public async Task Submit_Should_Throw_When_Deadline_Has_Passed()
    {
        _currentUserService.Setup(x => x.IsStudent).Returns(true);
        _currentUserService.Setup(x => x.UserId).Returns(10);

        var assignment = new Assignment
        {
            Id = 1,
            CourseId = 1,
            Status = AssignmentStatus.Published,
            DeadlineUtc = _utcNow.AddMinutes(-1)
        };

        _assignmentRepository
            .Setup(x => x.GetByIdAsync(1, It.IsAny<CancellationToken>()))
            .ReturnsAsync(assignment);

        var dto = new SubmitAssignmentDto
        {
            AssignmentId = 1,
            Answer = "My answer"
        };

        Func<Task> act = async () => await _submissionService.SubmitAsync(dto);

        await act.Should().ThrowAsync<BusinessException>()
            .WithMessage("Assignment deadline has passed.");
    }

    [Fact]
    public async Task Grade_Should_Throw_When_Marks_Exceed_MaxMarks()
    {
        _currentUserService.Setup(x => x.IsTeacher).Returns(true);
        _currentUserService.Setup(x => x.UserId).Returns(2);

        var submission = new Submission
        {
            Id = 1,
            Status = SubmissionStatus.Submitted,
            Assignment = new Assignment
            {
                Id = 1,
                MaxMarks = 10,
                CreatedById = 2,
                Course = new Course
                {
                    Id = 1,
                    TeacherId = 2
                }
            }
        };

        _submissionRepository
            .Setup(x => x.GetByIdWithAssignmentAsync(1, It.IsAny<CancellationToken>()))
            .ReturnsAsync(submission);

        var dto = new GradeSubmissionDto
        {
            Marks = 15,
            Feedback = "Good"
        };

        Func<Task> act = async () => await _submissionService.GradeAsync(1, dto);

        await act.Should().ThrowAsync<ValidationException>()
            .WithMessage("Marks cannot exceed maximum marks.");
    }
}
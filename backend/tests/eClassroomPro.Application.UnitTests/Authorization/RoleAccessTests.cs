using eClassroomPro.Application.DTOs.Assignments;
using eClassroomPro.Application.DTOs.Submissions;
using eClassroomPro.Application.Exceptions;
using eClassroomPro.Application.Interfaces;
using eClassroomPro.Application.Services;
using FluentAssertions;
using Moq;

namespace eClassroomPro.Application.UnitTests.Authorization;

public class RoleAccessTests
{
    private readonly Mock<IAssignmentRepository> _assignmentRepository = new();
    private readonly Mock<ICourseRepository> _courseRepository = new();
    private readonly Mock<ISubmissionRepository> _submissionRepository = new();
    private readonly Mock<ICurrentUserService> _currentUserService = new();
    private readonly Mock<IDateTimeProvider> _dateTimeProvider = new();
    private readonly Mock<IUnitOfWork> _unitOfWork = new();

    public RoleAccessTests()
    {
        _dateTimeProvider.Setup(x => x.UtcNow).Returns(DateTime.UtcNow);
    }

    [Fact]
    public async Task Student_Should_Not_Create_Assignment()
    {
        _currentUserService.Setup(x => x.IsStudent).Returns(true);
        _currentUserService.Setup(x => x.IsTeacher).Returns(false);
        _currentUserService.Setup(x => x.IsAdmin).Returns(false);
        _currentUserService.Setup(x => x.UserId).Returns(1);

        var assignmentService = new AssignmentService(
            _assignmentRepository.Object,
            _courseRepository.Object,
            _currentUserService.Object,
            _dateTimeProvider.Object,
            _unitOfWork.Object);

        var dto = new CreateAssignmentDto
        {
            CourseId = 1,
            Title = "Assignment",
            Description = "Description",
            DeadlineUtc = DateTime.UtcNow.AddDays(1),
            MaxMarks = 10
        };

        Func<Task> act = async () => await assignmentService.CreateAsync(dto);

        await act.Should().ThrowAsync<ForbiddenAccessException>();
    }

    [Fact]
    public async Task Student_Should_Not_Grade_Submission()
    {
        _currentUserService.Setup(x => x.IsStudent).Returns(true);
        _currentUserService.Setup(x => x.IsTeacher).Returns(false);
        _currentUserService.Setup(x => x.IsAdmin).Returns(false);

        var submissionService = new SubmissionService(
            _submissionRepository.Object,
            _assignmentRepository.Object,
            _courseRepository.Object,
            _currentUserService.Object,
            _dateTimeProvider.Object,
            _unitOfWork.Object);

        var dto = new GradeSubmissionDto
        {
            Marks = 10,
            Feedback = "Good"
        };

        Func<Task> act = async () => await submissionService.GradeAsync(1, dto);

        await act.Should().ThrowAsync<ForbiddenAccessException>();
    }
}
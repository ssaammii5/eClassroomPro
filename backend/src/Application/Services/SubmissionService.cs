using eClassroomPro.Application.DTOs.Submissions;
using eClassroomPro.Application.Exceptions;
using eClassroomPro.Application.Interfaces;
using eClassroomPro.Domain.Entities;
using eClassroomPro.Domain.Enums;

namespace eClassroomPro.Application.Services;

public class SubmissionService
{
    private readonly ISubmissionRepository _submissionRepository;
    private readonly IAssignmentRepository _assignmentRepository;
    private readonly ICourseRepository _courseRepository;
    private readonly ICurrentUserService _currentUserService;
    private readonly IDateTimeProvider _dateTimeProvider;
    private readonly IUnitOfWork _unitOfWork;

    public SubmissionService(
        ISubmissionRepository submissionRepository,
        IAssignmentRepository assignmentRepository,
        ICourseRepository courseRepository,
        ICurrentUserService currentUserService,
        IDateTimeProvider dateTimeProvider,
        IUnitOfWork unitOfWork)
    {
        _submissionRepository = submissionRepository;
        _assignmentRepository = assignmentRepository;
        _courseRepository = courseRepository;
        _currentUserService = currentUserService;
        _dateTimeProvider = dateTimeProvider;
        _unitOfWork = unitOfWork;
    }

    public async Task<SubmissionDto> SubmitAsync(SubmitAssignmentDto dto, CancellationToken cancellationToken = default)
    {
        if (!_currentUserService.IsStudent)
        {
            throw new ForbiddenAccessException("Only students can submit assignments.");
        }

        if (_currentUserService.UserId is null)
        {
            throw new UnauthorizedAccessException("User identity not found.");
        }

        if (string.IsNullOrWhiteSpace(dto.Answer))
        {
            throw new ValidationException("Submission answer cannot be empty.");
        }

        var assignment = await _assignmentRepository.GetByIdAsync(dto.AssignmentId, cancellationToken)
            ?? throw new NotFoundException("Assignment not found.");

        if (assignment.Status != AssignmentStatus.Published)
        {
            throw new BusinessException("Assignment is not available for submission.");
        }

        if (assignment.DeadlineUtc <= _dateTimeProvider.UtcNow)
        {
            throw new BusinessException("Assignment deadline has passed.");
        }

        var isEnrolled = await _courseRepository.IsStudentEnrolledAsync(
            assignment.CourseId,
            _currentUserService.UserId.Value,
            cancellationToken);

        if (!isEnrolled)
        {
            throw new ForbiddenAccessException("You are not enrolled in this course.");
        }

        var existingSubmission = await _submissionRepository.GetByAssignmentAndStudentAsync(
            assignment.Id,
            _currentUserService.UserId.Value,
            cancellationToken);

        if (existingSubmission is not null)
        {
            if (existingSubmission.Status == SubmissionStatus.Graded)
            {
                throw new BusinessException("Graded submissions cannot be updated.");
            }

            existingSubmission.Answer = dto.Answer.Trim();
            existingSubmission.Status = SubmissionStatus.Submitted;
            existingSubmission.SubmittedAtUtc = _dateTimeProvider.UtcNow;
            existingSubmission.UpdatedAtUtc = _dateTimeProvider.UtcNow;

            _submissionRepository.Update(existingSubmission);

            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return ToDto(existingSubmission);
        }

        var submission = new Submission
        {
            AssignmentId = assignment.Id,
            StudentId = _currentUserService.UserId.Value,
            Answer = dto.Answer.Trim(),
            Status = SubmissionStatus.Submitted,
            SubmittedAtUtc = _dateTimeProvider.UtcNow
        };

        await _submissionRepository.AddAsync(submission, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return ToDto(submission);
    }

    public async Task<SubmissionDto> GradeAsync(
        int submissionId,
        GradeSubmissionDto dto,
        CancellationToken cancellationToken = default)
    {
        if (!_currentUserService.IsTeacher && !_currentUserService.IsAdmin)
        {
            throw new ForbiddenAccessException("Only teachers or admins can grade submissions.");
        }

        var submission = await _submissionRepository.GetByIdWithAssignmentAsync(submissionId, cancellationToken)
            ?? throw new NotFoundException("Submission not found.");

        if (submission.Assignment is null)
        {
            throw new NotFoundException("Assignment for this submission was not found.");
        }

        EnsureCanManageAssignment(submission.Assignment);

        if (submission.Status != SubmissionStatus.Submitted)
        {
            throw new BusinessException("Only submitted work can be graded.");
        }

        if (dto.Marks < 0)
        {
            throw new ValidationException("Marks cannot be negative.");
        }

        if (dto.Marks > submission.Assignment.MaxMarks)
        {
            throw new ValidationException("Marks cannot exceed maximum marks.");
        }

        submission.Marks = dto.Marks;
        submission.Feedback = dto.Feedback?.Trim();
        submission.Status = SubmissionStatus.Graded;
        submission.UpdatedAtUtc = _dateTimeProvider.UtcNow;

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return ToDto(submission);
    }

    public async Task<SubmissionDto> ChangeStatusAsync(
        int submissionId,
        UpdateSubmissionStatusDto dto,
        CancellationToken cancellationToken = default)
    {
        if (!_currentUserService.IsTeacher && !_currentUserService.IsAdmin)
        {
            throw new ForbiddenAccessException("Only teachers or admins can change submission status.");
        }

        var submission = await _submissionRepository.GetByIdWithAssignmentAsync(submissionId, cancellationToken)
            ?? throw new NotFoundException("Submission not found.");

        if (submission.Assignment is null)
        {
            throw new NotFoundException("Assignment for this submission was not found.");
        }

        EnsureCanManageAssignment(submission.Assignment);

        if (dto.Status == SubmissionStatus.Graded && submission.Marks is null)
        {
            throw new BusinessException("Cannot mark a submission as graded without marks.");
        }

        if (dto.Status == SubmissionStatus.Submitted && submission.SubmittedAtUtc is null)
        {
            submission.SubmittedAtUtc = _dateTimeProvider.UtcNow;
        }

        submission.Status = dto.Status;
        submission.UpdatedAtUtc = _dateTimeProvider.UtcNow;

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return ToDto(submission);
    }

    public async Task<IReadOnlyList<SubmissionDto>> GetByAssignmentAsync(int assignmentId, CancellationToken cancellationToken = default)
    {
        if (!_currentUserService.IsTeacher && !_currentUserService.IsAdmin)
        {
            throw new ForbiddenAccessException("Only teachers or admins can view submissions for an assignment.");
        }

        var assignment = await _assignmentRepository.GetByIdAsync(assignmentId, cancellationToken)
            ?? throw new NotFoundException("Assignment not found.");

        EnsureCanManageAssignment(assignment);

        var submissions = await _submissionRepository.GetByAssignmentAsync(assignmentId, cancellationToken);

        return submissions.Select(ToDto).ToList();
    }

    public async Task<IReadOnlyList<SubmissionDto>> GetMySubmissionsAsync(CancellationToken cancellationToken = default)
    {
        if (!_currentUserService.IsStudent)
        {
            throw new ForbiddenAccessException("Only students can view their submissions.");
        }

        if (_currentUserService.UserId is null)
        {
            throw new UnauthorizedAccessException("User identity not found.");
        }

        var submissions = await _submissionRepository.GetByStudentAsync(_currentUserService.UserId.Value, cancellationToken);

        return submissions.Select(ToDto).ToList();
    }

private void EnsureCanManageAssignment(Assignment assignment)
{
    if (_currentUserService.IsAdmin)
    {
        return;
    }

    if (!_currentUserService.IsTeacher)
    {
        throw new ForbiddenAccessException("Only teachers or admins can manage submissions.");
    }

    var isAssignmentCreator = assignment.CreatedById == _currentUserService.UserId;
    var isPrimaryTeacher = assignment.Course?.TeacherId == _currentUserService.UserId;
    var isCourseTeacher = assignment.Course?.CourseTeachers.Any(x => x.TeacherId == _currentUserService.UserId) ?? false;

    if (!isAssignmentCreator && !isPrimaryTeacher && !isCourseTeacher)
    {
        throw new ForbiddenAccessException("You do not have permission to manage this submission.");
    }
}

    private static SubmissionDto ToDto(Submission submission)
    {
        return new SubmissionDto
        {
            Id = submission.Id,
            AssignmentId = submission.AssignmentId,
            AssignmentTitle = submission.Assignment?.Title,
            StudentId = submission.StudentId,
            StudentName = submission.Student?.Name,
            Answer = submission.Answer,
            Status = submission.Status,
            Marks = submission.Marks,
            Feedback = submission.Feedback,
            SubmittedAtUtc = submission.SubmittedAtUtc,
            CreatedAtUtc = submission.CreatedAtUtc
        };
    }
}
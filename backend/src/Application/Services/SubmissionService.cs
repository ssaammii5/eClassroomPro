using eClassroomPro.Application.DTOs.Submissions;
using eClassroomPro.Application.Exceptions;
using eClassroomPro.Application.Interfaces;
using eClassroomPro.Domain.Entities;
using eClassroomPro.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace eClassroomPro.Application.Services;

public class SubmissionService
{
    private const int PendingKeyMultiplier = 1_000_000;

    private readonly ISubmissionRepository _submissionRepository;
    private readonly IAssignmentRepository _assignmentRepository;
    private readonly ICourseRepository _courseRepository;
    private readonly ICurrentUserService _currentUserService;
    private readonly IDateTimeProvider _dateTimeProvider;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IApplicationDbContext _db;

    public SubmissionService(
        ISubmissionRepository submissionRepository,
        IAssignmentRepository assignmentRepository,
        ICourseRepository courseRepository,
        ICurrentUserService currentUserService,
        IDateTimeProvider dateTimeProvider,
        IUnitOfWork unitOfWork,
        IApplicationDbContext db)
    {
        _submissionRepository = submissionRepository;
        _assignmentRepository = assignmentRepository;
        _courseRepository = courseRepository;
        _currentUserService = currentUserService;
        _dateTimeProvider = dateTimeProvider;
        _unitOfWork = unitOfWork;
        _db = db;
    }

    // ──────────────────────────────────────────────── Student submit
    public async Task<SubmissionDto> SubmitAsync(SubmitAssignmentDto dto, CancellationToken cancellationToken = default)
    {
        if (!_currentUserService.IsStudent)
            throw new ForbiddenAccessException("Only students can submit assignments.");

        if (_currentUserService.UserId is null)
            throw new UnauthorizedAccessException("User identity not found.");

        if (string.IsNullOrWhiteSpace(dto.Answer))
            throw new ValidationException("Submission answer cannot be empty.");

        var assignment = await _assignmentRepository.GetByIdAsync(dto.AssignmentId, cancellationToken)
            ?? throw new NotFoundException("Assignment not found.");

        if (assignment.Status != AssignmentStatus.Published)
            throw new BusinessException("Assignment is not available for submission.");

        if (assignment.DeadlineUtc <= _dateTimeProvider.UtcNow)
            throw new BusinessException("Assignment deadline has passed.");

        var isEnrolled = await _courseRepository.IsStudentEnrolledAsync(
            assignment.CourseId,
            _currentUserService.UserId.Value,
            cancellationToken);

        if (!isEnrolled)
            throw new ForbiddenAccessException("You are not enrolled in this course.");

        var existingSubmission = await _submissionRepository.GetByAssignmentAndStudentAsync(
            assignment.Id,
            _currentUserService.UserId.Value,
            cancellationToken);

        int submissionId;

        if (existingSubmission is not null)
        {
            if (existingSubmission.Status == SubmissionStatus.Graded)
                throw new BusinessException("Graded submissions cannot be updated.");

            existingSubmission.Answer = dto.Answer.Trim();
            existingSubmission.Status = SubmissionStatus.Submitted;
            existingSubmission.SubmittedAtUtc = _dateTimeProvider.UtcNow;
            existingSubmission.UpdatedAtUtc = _dateTimeProvider.UtcNow;
            _submissionRepository.Update(existingSubmission);
            submissionId = existingSubmission.Id;

            await AddActivityAsync(submissionId, "Resubmitted assignment", _currentUserService.UserId.Value, cancellationToken);
        }
        else
        {
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
            submissionId = submission.Id;

            await AddActivityAsync(submissionId, "Submitted assignment", _currentUserService.UserId.Value, cancellationToken);
        }

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        var full = await _submissionRepository.GetByIdWithFullDetailAsync(submissionId, cancellationToken);
        return MapToDto(full!);
    }

    // ──────────────────────────────────────────────── Grade
    public async Task<SubmissionDto> GradeAsync(
        int submissionId,
        GradeSubmissionDto dto,
        CancellationToken cancellationToken = default)
    {
        if (!_currentUserService.IsTeacher && !_currentUserService.IsAdmin)
            throw new ForbiddenAccessException("Only teachers or admins can grade submissions.");

        var submission = await _submissionRepository.GetByIdWithAssignmentAsync(submissionId, cancellationToken)
            ?? throw new NotFoundException("Submission not found.");

        if (submission.Assignment is null)
            throw new NotFoundException("Assignment for this submission was not found.");

        EnsureCanManageAssignment(submission.Assignment);

        if (submission.Status != SubmissionStatus.Submitted)
            throw new BusinessException("Only submitted work can be graded.");

        if (dto.Marks < 0)
            throw new ValidationException("Marks cannot be negative.");

        if (dto.Marks > submission.Assignment.MaxMarks)
            throw new ValidationException("Marks cannot exceed maximum marks.");

        submission.Marks = dto.Marks;
        submission.Feedback = dto.Feedback?.Trim();
        submission.Status = SubmissionStatus.Graded;
        submission.GradedById = _currentUserService.UserId;
        submission.GradedAtUtc = _dateTimeProvider.UtcNow;
        submission.UpdatedAtUtc = _dateTimeProvider.UtcNow;

        await AddActivityAsync(
            submission.Id,
            $"Graded — {dto.Marks}/{submission.Assignment.MaxMarks}",
            _currentUserService.UserId!.Value,
            cancellationToken);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        var full = await _submissionRepository.GetByIdWithFullDetailAsync(submissionId, cancellationToken);
        return MapToDto(full!);
    }

    // ──────────────────────────────────────────────── Change status
    public async Task<SubmissionDto> ChangeStatusAsync(
        int submissionId,
        UpdateSubmissionStatusDto dto,
        CancellationToken cancellationToken = default)
    {
        if (!_currentUserService.IsTeacher && !_currentUserService.IsAdmin)
            throw new ForbiddenAccessException("Only teachers or admins can change submission status.");

        var submission = await _submissionRepository.GetByIdWithAssignmentAsync(submissionId, cancellationToken)
            ?? throw new NotFoundException("Submission not found.");

        if (submission.Assignment is null)
            throw new NotFoundException("Assignment for this submission was not found.");

        EnsureCanManageAssignment(submission.Assignment);

        if (dto.Status == SubmissionStatus.Graded && submission.Marks is null)
            throw new BusinessException("Cannot mark a submission as graded without marks.");

        if (dto.Status == SubmissionStatus.Submitted && submission.SubmittedAtUtc is null)
            submission.SubmittedAtUtc = _dateTimeProvider.UtcNow;

        submission.Status = dto.Status;
        submission.UpdatedAtUtc = _dateTimeProvider.UtcNow;

        await AddActivityAsync(
            submission.Id,
            $"Status changed to {dto.Status}",
            _currentUserService.UserId!.Value,
            cancellationToken);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        var full = await _submissionRepository.GetByIdWithFullDetailAsync(submissionId, cancellationToken);
        return MapToDto(full!);
    }

    // ──────────────────────────────────────────────── By assignment (teacher/admin)
    public async Task<IReadOnlyList<SubmissionDto>> GetByAssignmentAsync(int assignmentId, CancellationToken cancellationToken = default)
    {
        if (!_currentUserService.IsTeacher && !_currentUserService.IsAdmin)
            throw new ForbiddenAccessException("Only teachers or admins can view submissions for an assignment.");

        var assignment = await _assignmentRepository.GetByIdAsync(assignmentId, cancellationToken)
            ?? throw new NotFoundException("Assignment not found.");

        EnsureCanManageAssignment(assignment);

        var submissions = await _submissionRepository.GetByAssignmentAsync(assignmentId, cancellationToken);
        return submissions.Select(MapToDto).ToList();
    }

    // ──────────────────────────────────────────────── My submissions (student)
    public async Task<IReadOnlyList<SubmissionDto>> GetMySubmissionsAsync(CancellationToken cancellationToken = default)
    {
        if (!_currentUserService.IsStudent)
            throw new ForbiddenAccessException("Only students can view their submissions.");

        if (_currentUserService.UserId is null)
            throw new UnauthorizedAccessException("User identity not found.");

        var submissions = await _submissionRepository.GetByStudentAsync(_currentUserService.UserId.Value, cancellationToken);
        return submissions.Select(MapToDto).ToList();
    }

    // ──────────────────────────────────────────────── Phase 6: all submissions (admin/teacher)
    public async Task<IReadOnlyList<SubmissionDto>> GetAllForAdminAsync(CancellationToken cancellationToken = default)
    {
        if (!_currentUserService.IsTeacher && !_currentUserService.IsAdmin)
            throw new ForbiddenAccessException("Only teachers or admins can view all submissions.");

        var assignments = await _db.Assignments
            .AsNoTracking()
            .Where(a => a.Status == AssignmentStatus.Published)
            .Include(a => a.CreatedBy)
            .Include(a => a.Course)
                .ThenInclude(c => c!.Enrollments)
                .ThenInclude(e => e.User)
                .ThenInclude(u => u!.StudentDetails)
            .Include(a => a.Submissions)
                .ThenInclude(s => s.Student)
                .ThenInclude(u => u!.StudentDetails)
            .Include(a => a.Submissions).ThenInclude(s => s.Attachments)
            .Include(a => a.Submissions).ThenInclude(s => s.Activities).ThenInclude(x => x.Actor)
            .Include(a => a.Submissions).ThenInclude(s => s.GradedBy)
            .ToListAsync(cancellationToken);

        var result = new List<SubmissionDto>();

        foreach (var assignment in assignments)
        {
            var course = assignment.Course;
            if (course is null) continue;

            foreach (var enrollment in course.Enrollments)
            {
                var student = enrollment.User;
                if (student is null || student.Role != Role.Student) continue;

                var submission = assignment.Submissions.FirstOrDefault(s => s.StudentId == student.Id);

                result.Add(submission is not null
                    ? MapToDto(submission)
                    : BuildPendingDto(assignment, student));
            }
        }

        return result
            .OrderByDescending(x => x.SubmittedAtUtc ?? DateTime.MinValue)
            .ToList();
    }

    // ──────────────────────────────────────────────── Phase 6: detail (admin/teacher)
    public async Task<SubmissionDto> GetDetailAsync(int id, CancellationToken cancellationToken = default)
    {
        if (!_currentUserService.IsTeacher && !_currentUserService.IsAdmin)
            throw new ForbiddenAccessException("Only teachers or admins can view submission details.");

        // Negative id → pending (not submitted) row synthesized from an assignment + student pair.
        if (id < 0)
        {
            var key = -id;
            var assignmentId = key / PendingKeyMultiplier;
            var studentId = key % PendingKeyMultiplier;
            return await BuildPendingDetailAsync(assignmentId, studentId, cancellationToken);
        }

        var submission = await _submissionRepository.GetByIdWithFullDetailAsync(id, cancellationToken)
            ?? throw new NotFoundException("Submission not found.");

        if (submission.Assignment is not null)
            EnsureCanManageAssignment(submission.Assignment);

        return MapToDto(submission);
    }

    // ──────────────────────────────────────────────── helpers
    private async Task<SubmissionDto> BuildPendingDetailAsync(int assignmentId, int studentId, CancellationToken cancellationToken)
    {
        var assignment = await _db.Assignments
            .AsNoTracking()
            .Include(a => a.Course)
            .Include(a => a.CreatedBy)
            .FirstOrDefaultAsync(a => a.Id == assignmentId, cancellationToken)
            ?? throw new NotFoundException("Submission not found.");

        var student = await _db.Users
            .AsNoTracking()
            .Include(u => u.StudentDetails)
            .FirstOrDefaultAsync(u => u.Id == studentId, cancellationToken)
            ?? throw new NotFoundException("Submission not found.");

        return BuildPendingDto(assignment, student);
    }

    private static SubmissionDto BuildPendingDto(Assignment assignment, User student)
    {
        var course = assignment.Course;

        return new SubmissionDto
        {
            Id = -(assignment.Id * PendingKeyMultiplier + student.Id),
            AssignmentId = assignment.Id,
            AssignmentTitle = assignment.Title,
            CourseId = assignment.CourseId,
            CourseName = course?.Name,
            Program = course?.Program,
            Department = course?.Department,
            Session = course?.Session,
            StudentId = student.Id,
            StudentName = student.Name,
            StudentEmail = student.Email,
            StudentAcademicId = student.StudentDetails?.StudentId,
            StudentDepartment = student.StudentDetails?.Department,
            StudentProgram = student.StudentDetails?.CurrentProgram,
            Answer = string.Empty,
            Status = SubmissionStatus.Draft,
            Marks = null,
            Feedback = null,
            SubmittedAtUtc = null,
            CreatedAtUtc = assignment.CreatedAtUtc,
            GradedById = null,
            GradedByName = null,
            GradedAtUtc = null,
            IsLate = false,
            MaxMarks = assignment.MaxMarks,
            Attachments = new List<SubmissionAttachmentDto>(),
            Activities = new List<SubmissionActivityDto>
            {
                new()
                {
                    Id = 0,
                    Action = "Assignment published",
                    ActorName = assignment.CreatedBy?.Name ?? "System",
                    TimestampUtc = assignment.CreatedAtUtc
                }
            }
        };
    }

    private async Task AddActivityAsync(int submissionId, string action, int actorId, CancellationToken cancellationToken)
    {
        await _db.SubmissionActivities.AddAsync(new SubmissionActivity
        {
            SubmissionId = submissionId,
            Action = action,
            ActorId = actorId
        }, cancellationToken);
    }

    private void EnsureCanManageAssignment(Assignment assignment)
    {
        if (_currentUserService.IsAdmin)
            return;

        if (!_currentUserService.IsTeacher)
            throw new ForbiddenAccessException("Only teachers or admins can manage submissions.");

        var isAssignmentCreator = assignment.CreatedById == _currentUserService.UserId;
        var isPrimaryTeacher = assignment.Course?.TeacherId == _currentUserService.UserId;
        var isCourseTeacher = assignment.Course?.CourseTeachers.Any(x => x.TeacherId == _currentUserService.UserId) ?? false;

        if (!isAssignmentCreator && !isPrimaryTeacher && !isCourseTeacher)
            throw new ForbiddenAccessException("You do not have permission to manage this submission.");
    }

    private static SubmissionDto MapToDto(Submission submission)
    {
        var assignment = submission.Assignment;
        var course = assignment?.Course;
        var student = submission.Student;

        var isLate = submission.SubmittedAtUtc.HasValue &&
                     assignment is not null &&
                     submission.SubmittedAtUtc.Value > assignment.DeadlineUtc;

        return new SubmissionDto
        {
            Id = submission.Id,
            AssignmentId = submission.AssignmentId,
            AssignmentTitle = assignment?.Title,
            CourseId = assignment?.CourseId ?? 0,
            CourseName = course?.Name,
            Program = course?.Program,
            Department = course?.Department,
            Session = course?.Session,
            StudentId = submission.StudentId,
            StudentName = student?.Name,
            StudentEmail = student?.Email,
            StudentAcademicId = student?.StudentDetails?.StudentId,
            StudentDepartment = student?.StudentDetails?.Department,
            StudentProgram = student?.StudentDetails?.CurrentProgram,
            Answer = submission.Answer,
            Status = submission.Status,
            Marks = submission.Marks,
            Feedback = submission.Feedback,
            SubmittedAtUtc = submission.SubmittedAtUtc,
            CreatedAtUtc = submission.CreatedAtUtc,
            GradedById = submission.GradedById,
            GradedByName = submission.GradedBy?.Name,
            GradedAtUtc = submission.GradedAtUtc,
            IsLate = isLate,
            MaxMarks = assignment?.MaxMarks ?? 0,
            Attachments = submission.Attachments
                .Select(a => new SubmissionAttachmentDto
                {
                    Id = a.Id,
                    FileName = a.FileName,
                    FileType = a.FileType,
                    FileSize = FormatFileSize(a.FileSize),
                    UploadedAtUtc = a.CreatedAtUtc,
                    Kind = a.Kind,
                    Url = a.Url
                })
                .ToList(),
            Activities = submission.Activities
                .OrderBy(x => x.CreatedAtUtc)
                .Select(x => new SubmissionActivityDto
                {
                    Id = x.Id,
                    Action = x.Action,
                    ActorName = x.Actor?.Name ?? "System",
                    TimestampUtc = x.CreatedAtUtc
                })
                .ToList()
        };
    }

    private static string FormatFileSize(long bytes)
    {
        if (bytes < 1024) return $"{bytes} B";
        if (bytes < 1024 * 1024) return $"{bytes / 1024.0:0.#} KB";
        return $"{bytes / (1024.0 * 1024.0):0.#} MB";
    }
}
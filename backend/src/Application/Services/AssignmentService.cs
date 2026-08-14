using eClassroomPro.Application.DTOs.Assignments;
using eClassroomPro.Application.Exceptions;
using eClassroomPro.Application.Interfaces;
using eClassroomPro.Domain.Entities;
using eClassroomPro.Domain.Enums;

namespace eClassroomPro.Application.Services;

public class AssignmentService
{
    private readonly IAssignmentRepository _assignmentRepository;
    private readonly ICourseRepository _courseRepository;
    private readonly ISubmissionRepository _submissionRepository;
    private readonly ICurrentUserService _currentUserService;
    private readonly IDateTimeProvider _dateTimeProvider;
    private readonly IUnitOfWork _unitOfWork;

    public AssignmentService(
        IAssignmentRepository assignmentRepository,
        ICourseRepository courseRepository,
        ISubmissionRepository submissionRepository,
        ICurrentUserService currentUserService,
        IDateTimeProvider dateTimeProvider,
        IUnitOfWork unitOfWork)
    {
        _assignmentRepository = assignmentRepository;
        _courseRepository = courseRepository;
        _submissionRepository = submissionRepository;
        _currentUserService = currentUserService;
        _dateTimeProvider = dateTimeProvider;
        _unitOfWork = unitOfWork;
    }

    public async Task<IReadOnlyList<AssignmentDto>> GetAllForCurrentUserAsync(CancellationToken cancellationToken = default)
    {
        if (_currentUserService.UserId is null)
        {
            throw new UnauthorizedAccessException("User identity not found.");
        }

        IReadOnlyList<Assignment> assignments;

        if (_currentUserService.IsAdmin)
        {
            assignments = await _assignmentRepository.GetAllAsync(cancellationToken);
        }
        else if (_currentUserService.IsTeacher)
        {
            assignments = await _assignmentRepository.GetForTeacherAsync(_currentUserService.UserId.Value, cancellationToken);
        }
        else if (_currentUserService.IsStudent)
        {
            assignments = await _assignmentRepository.GetPublishedForStudentAsync(_currentUserService.UserId.Value, cancellationToken);
        }
        else
        {
            throw new ForbiddenAccessException("Invalid role.");
        }

        return assignments.Select(ToDto).ToList();
    }

    public async Task<AssignmentDto> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        if (_currentUserService.UserId is null)
        {
            throw new UnauthorizedAccessException("User identity not found.");
        }

        var assignment = await _assignmentRepository.GetByIdAsync(id, cancellationToken)
            ?? throw new NotFoundException("Assignment not found.");

        if (_currentUserService.IsStudent)
        {
            if (assignment.Status != AssignmentStatus.Published)
            {
                throw new NotFoundException("Assignment not found.");
            }

            var isEnrolled = await _courseRepository.IsStudentEnrolledAsync(
                assignment.CourseId,
                _currentUserService.UserId.Value,
                cancellationToken);

            if (!isEnrolled)
            {
                throw new NotFoundException("Assignment not found.");
            }
        }

        return ToDto(assignment);
    }

    // Phase 8: classwork for a specific course (role-aware).
    public async Task<IReadOnlyList<AssignmentDto>> GetForCourseAsync(int courseId, CancellationToken cancellationToken = default)
    {
        if (_currentUserService.UserId is null)
        {
            throw new UnauthorizedAccessException("User identity not found.");
        }

        var course = await _courseRepository.GetByIdAsync(courseId, cancellationToken)
            ?? throw new NotFoundException("Course not found.");

        if (_currentUserService.IsStudent)
        {
            var isEnrolled = await _courseRepository.IsStudentEnrolledAsync(
                courseId,
                _currentUserService.UserId.Value,
                cancellationToken);

            if (!isEnrolled)
            {
                throw new ForbiddenAccessException("You are not enrolled in this course.");
            }

            var assignments = await _assignmentRepository.GetPublishedForCourseAsync(courseId, cancellationToken);
            var mySubmissions = await _submissionRepository.GetByStudentAsync(_currentUserService.UserId.Value, cancellationToken);
            var subByAssignment = mySubmissions.ToDictionary(s => s.AssignmentId);

            return assignments.Select(a =>
            {
                var dto = ToDto(a);
                dto.MySubmissionStatus = subByAssignment.TryGetValue(a.Id, out var sub)
                    ? MapSubmissionStatus(sub.Status)
                    : "Assigned";
                return dto;
            }).ToList();
        }

        EnsureCanManageCourse(course);

        var all = await _assignmentRepository.GetForCourseAsync(courseId, cancellationToken);
        return all.Select(ToDto).ToList();
    }

    public async Task<int> CreateAsync(CreateAssignmentDto dto, CancellationToken cancellationToken = default)
    {
        if (!_currentUserService.IsTeacher && !_currentUserService.IsAdmin)
        {
            throw new ForbiddenAccessException("Only teachers or admins can create assignments.");
        }

        if (_currentUserService.UserId is null)
        {
            throw new UnauthorizedAccessException("User identity not found.");
        }

        if (string.IsNullOrWhiteSpace(dto.Title))
        {
            throw new ValidationException("Assignment title is required.");
        }

        if (dto.MaxMarks <= 0)
        {
            throw new ValidationException("Maximum marks must be greater than zero.");
        }

        if (dto.DeadlineUtc <= _dateTimeProvider.UtcNow)
        {
            throw new BusinessException("Assignment deadline must be in the future.");
        }

        var course = await _courseRepository.GetByIdAsync(dto.CourseId, cancellationToken)
            ?? throw new NotFoundException("Course not found.");

        if (_currentUserService.IsTeacher)
        {
            var isTeacherOfCourse = course.TeacherId == _currentUserService.UserId
                || course.CourseTeachers.Any(x => x.TeacherId == _currentUserService.UserId);

            if (!isTeacherOfCourse)
            {
                throw new ForbiddenAccessException("You can create assignments only for courses assigned to you.");
            }
        }

        var assignment = new Assignment
        {
            Title = dto.Title.Trim(),
            Description = dto.Description.Trim(),
            Topic = dto.Topic?.Trim() ?? string.Empty,
            Kind = dto.Kind,
            CourseId = course.Id,
            CreatedById = _currentUserService.UserId.Value,
            DeadlineUtc = dto.DeadlineUtc,
            MaxMarks = dto.MaxMarks,
            Status = AssignmentStatus.Draft
        };

        await _assignmentRepository.AddAsync(assignment, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return assignment.Id;
    }

    public async Task UpdateAsync(int id, UpdateAssignmentDto dto, CancellationToken cancellationToken = default)
    {
        var assignment = await _assignmentRepository.GetByIdAsync(id, cancellationToken)
            ?? throw new NotFoundException("Assignment not found.");

        EnsureCanManageAssignment(assignment);

        if (string.IsNullOrWhiteSpace(dto.Title))
        {
            throw new ValidationException("Assignment title is required.");
        }

        if (dto.MaxMarks <= 0)
        {
            throw new ValidationException("Maximum marks must be greater than zero.");
        }

        if (dto.DeadlineUtc <= _dateTimeProvider.UtcNow)
        {
            throw new BusinessException("Assignment deadline must be in the future.");
        }

        if (assignment.Status == AssignmentStatus.Published)
        {
            var hasSubmissions = await _assignmentRepository.AnySubmittedAsync(id, cancellationToken);
            if (hasSubmissions)
            {
                throw new BusinessException("Cannot update a published assignment after students have submitted.");
            }
        }

        assignment.Title = dto.Title.Trim();
        assignment.Description = dto.Description.Trim();
        assignment.Topic = dto.Topic?.Trim() ?? string.Empty;
        assignment.Kind = dto.Kind;
        assignment.DeadlineUtc = dto.DeadlineUtc;
        assignment.MaxMarks = dto.MaxMarks;
        assignment.UpdatedAtUtc = _dateTimeProvider.UtcNow;

        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }

    public async Task DeleteAsync(int id, CancellationToken cancellationToken = default)
    {
        var assignment = await _assignmentRepository.GetByIdAsync(id, cancellationToken)
            ?? throw new NotFoundException("Assignment not found.");

        EnsureCanManageAssignment(assignment);

        var hasSubmissions = await _assignmentRepository.AnySubmittedAsync(id, cancellationToken);
        if (hasSubmissions)
        {
            throw new BusinessException("Cannot delete an assignment that has student submissions.");
        }

        _assignmentRepository.Remove(assignment);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }

    public async Task PublishAsync(int id, CancellationToken cancellationToken = default)
    {
        var assignment = await _assignmentRepository.GetByIdAsync(id, cancellationToken)
            ?? throw new NotFoundException("Assignment not found.");

        EnsureCanManageAssignment(assignment);

        if (assignment.Status != AssignmentStatus.Draft)
        {
            throw new BusinessException("Only draft assignments can be published.");
        }

        if (assignment.DeadlineUtc <= _dateTimeProvider.UtcNow)
        {
            throw new BusinessException("Cannot publish an assignment after its deadline.");
        }

        assignment.Status = AssignmentStatus.Published;
        assignment.UpdatedAtUtc = _dateTimeProvider.UtcNow;

        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }

    private void EnsureCanManageCourse(Course course)
    {
        if (_currentUserService.IsAdmin)
        {
            return;
        }

        if (!_currentUserService.IsTeacher)
        {
            throw new ForbiddenAccessException("Only teachers or admins can manage this course.");
        }

        var isTeacher = course.TeacherId == _currentUserService.UserId
            || course.CourseTeachers.Any(x => x.TeacherId == _currentUserService.UserId);

        if (!isTeacher)
        {
            throw new ForbiddenAccessException("You do not have permission to manage this course.");
        }
    }

    private void EnsureCanManageAssignment(Assignment assignment)
    {
        if (_currentUserService.IsAdmin)
        {
            return;
        }

        if (!_currentUserService.IsTeacher)
        {
            throw new ForbiddenAccessException("Only teachers or admins can manage assignments.");
        }

        var isCreator = assignment.CreatedById == _currentUserService.UserId;
        var isPrimaryTeacher = assignment.Course?.TeacherId == _currentUserService.UserId;
        var isCourseTeacher = assignment.Course?.CourseTeachers.Any(x => x.TeacherId == _currentUserService.UserId) ?? false;

        if (!isCreator && !isPrimaryTeacher && !isCourseTeacher)
        {
            throw new ForbiddenAccessException("You do not have permission to manage this assignment.");
        }
    }

    private static string MapSubmissionStatus(SubmissionStatus status) => status switch
    {
        SubmissionStatus.Submitted => "Submitted",
        SubmissionStatus.Graded => "Graded",
        _ => "Assigned"
    };

    private static AssignmentDto ToDto(Assignment assignment)
    {
        return new AssignmentDto
        {
            Id = assignment.Id,
            CourseId = assignment.CourseId,
            CourseName = assignment.Course?.Name,
            Subject = assignment.Course?.Subject,
            Program = assignment.Course?.Program,
            Department = assignment.Course?.Department,
            Session = assignment.Course?.Session,
            Title = assignment.Title,
            Description = assignment.Description,
            Topic = assignment.Topic,
            Kind = assignment.Kind,
            DeadlineUtc = assignment.DeadlineUtc,
            MaxMarks = assignment.MaxMarks,
            Status = assignment.Status,
            CreatedById = assignment.CreatedById,
            CreatedByName = assignment.CreatedBy?.Name,
            CreatedAtUtc = assignment.CreatedAtUtc,
            SubmissionCount = assignment.Submissions?.Count ?? 0
        };
    }
}
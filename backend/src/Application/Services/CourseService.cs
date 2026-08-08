using eClassroomPro.Application.DTOs.Courses;
using eClassroomPro.Application.Exceptions;
using eClassroomPro.Application.Interfaces;
using eClassroomPro.Domain.Entities;
using eClassroomPro.Domain.Enums;

namespace eClassroomPro.Application.Services;

public class CourseService
{
    private readonly ICourseRepository _courseRepository;
    private readonly IUserRepository _userRepository;
    private readonly ICurrentUserService _currentUserService;
    private readonly IUnitOfWork _unitOfWork;

    public CourseService(
        ICourseRepository courseRepository,
        IUserRepository userRepository,
        ICurrentUserService currentUserService,
        IUnitOfWork unitOfWork)
    {
        _courseRepository = courseRepository;
        _userRepository = userRepository;
        _currentUserService = currentUserService;
        _unitOfWork = unitOfWork;
    }

    public async Task<IReadOnlyList<CourseDto>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        var courses = await _courseRepository.GetAllAsync(cancellationToken);

        return courses.Select(ToDto).ToList();
    }

    public async Task<CourseDto> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        var course = await _courseRepository.GetByIdAsync(id, cancellationToken)
            ?? throw new NotFoundException("Course not found.");

        return ToDto(course);
    }

    public async Task<CourseDto> CreateAsync(CreateCourseDto dto, CancellationToken cancellationToken = default)
    {
        EnsureAdmin();

        if (string.IsNullOrWhiteSpace(dto.Name))
        {
            throw new ValidationException("Course name is required.");
        }

        if (string.IsNullOrWhiteSpace(dto.Subject))
        {
            throw new ValidationException("Course subject is required.");
        }

        if (dto.TeacherId.HasValue)
        {
            await EnsureTeacherExistsAsync(dto.TeacherId.Value, cancellationToken);
        }

        var course = new Course
        {
            Name = dto.Name.Trim(),
            Subject = dto.Subject.Trim(),
            TeacherId = dto.TeacherId
        };

        await _courseRepository.AddAsync(course, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return ToDto(course);
    }

    public async Task UpdateAsync(int id, UpdateCourseDto dto, CancellationToken cancellationToken = default)
    {
        EnsureAdmin();

        var course = await _courseRepository.GetByIdAsync(id, cancellationToken)
            ?? throw new NotFoundException("Course not found.");

        if (dto.TeacherId.HasValue)
        {
            await EnsureTeacherExistsAsync(dto.TeacherId.Value, cancellationToken);
        }

        course.Name = dto.Name.Trim();
        course.Subject = dto.Subject.Trim();
        course.TeacherId = dto.TeacherId;
        course.UpdatedAtUtc = DateTime.UtcNow;

        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }

    public async Task DeleteAsync(int id, CancellationToken cancellationToken = default)
    {
        EnsureAdmin();

        var course = await _courseRepository.GetByIdAsync(id, cancellationToken)
            ?? throw new NotFoundException("Course not found.");

        _courseRepository.Remove(course);

        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }

    public async Task AssignTeacherAsync(int courseId, int teacherId, CancellationToken cancellationToken = default)
    {
        EnsureAdmin();

        var course = await _courseRepository.GetByIdAsync(courseId, cancellationToken)
            ?? throw new NotFoundException("Course not found.");

        await EnsureTeacherExistsAsync(teacherId, cancellationToken);

        course.TeacherId = teacherId;
        course.UpdatedAtUtc = DateTime.UtcNow;

        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }

    public async Task EnrollStudentAsync(int courseId, int studentId, CancellationToken cancellationToken = default)
    {
        EnsureAdmin();

        var course = await _courseRepository.GetByIdAsync(courseId, cancellationToken)
            ?? throw new NotFoundException("Course not found.");

        var student = await _userRepository.GetByIdAsync(studentId, cancellationToken)
            ?? throw new NotFoundException("Student not found.");

        if (student.Role != Role.Student)
        {
            throw new BusinessException("Selected user is not a student.");
        }

        if (await _courseRepository.IsStudentEnrolledAsync(courseId, studentId, cancellationToken))
        {
            throw new BusinessException("Student is already enrolled in this course.");
        }

        await _courseRepository.EnrollStudentAsync(courseId, studentId, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }

    private async Task EnsureTeacherExistsAsync(int teacherId, CancellationToken cancellationToken)
    {
        var teacher = await _userRepository.GetByIdAsync(teacherId, cancellationToken)
            ?? throw new NotFoundException("Teacher not found.");

        if (teacher.Role != Role.Teacher)
        {
            throw new BusinessException("Selected user is not a teacher.");
        }
    }

    private void EnsureAdmin()
    {
        if (!_currentUserService.IsAdmin)
        {
            throw new ForbiddenAccessException("Only admins can manage courses.");
        }
    }

    private static CourseDto ToDto(Course course)
    {
        return new CourseDto
        {
            Id = course.Id,
            Name = course.Name,
            Subject = course.Subject,
            TeacherId = course.TeacherId,
            TeacherName = course.Teacher?.Name,
            StudentCount = course.Enrollments.Count
        };
    }
}
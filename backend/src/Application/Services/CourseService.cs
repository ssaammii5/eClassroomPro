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
        var course = await _courseRepository.GetByIdWithDetailsAsync(id, cancellationToken)
            ?? throw new NotFoundException("Course not found.");
        return ToDto(course);
    }

    public async Task<CourseDto> CreateAsync(CreateCourseDto dto, CancellationToken cancellationToken = default)
    {
        EnsureAdmin();

        if (string.IsNullOrWhiteSpace(dto.Name))
            throw new ValidationException("Course name is required.");

        var course = new Course
        {
            Name = dto.Name.Trim(),
            Subject = dto.Subject?.Trim() ?? string.Empty,
            Program = dto.Program?.Trim() ?? string.Empty,
            Department = dto.Department?.Trim() ?? string.Empty,
            Session = dto.Session?.Trim() ?? string.Empty,
            IsActive = dto.IsActive,
            TeacherId = dto.TeacherIds.FirstOrDefault()
        };

        await _courseRepository.AddAsync(course, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        await SyncTeachersAsync(course, dto.TeacherIds, cancellationToken);
        await SyncStudentsAsync(course, dto.StudentIds, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return await GetByIdAsync(course.Id, cancellationToken);
    }

    public async Task UpdateAsync(int id, UpdateCourseDto dto, CancellationToken cancellationToken = default)
    {
        EnsureAdmin();

        var course = await _courseRepository.GetByIdAsync(id, cancellationToken)
            ?? throw new NotFoundException("Course not found.");

        if (string.IsNullOrWhiteSpace(dto.Name))
            throw new ValidationException("Course name is required.");

        course.Name = dto.Name.Trim();
        course.Subject = dto.Subject?.Trim() ?? string.Empty;
        course.Program = dto.Program?.Trim() ?? string.Empty;
        course.Department = dto.Department?.Trim() ?? string.Empty;
        course.Session = dto.Session?.Trim() ?? string.Empty;
        course.IsActive = dto.IsActive;
        course.TeacherId = dto.TeacherIds.FirstOrDefault();
        course.UpdatedAtUtc = DateTime.UtcNow;

        await SyncTeachersAsync(course, dto.TeacherIds, cancellationToken);
        await SyncStudentsAsync(course, dto.StudentIds, cancellationToken);
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

    private async Task SyncTeachersAsync(Course course, List<int> teacherIds, CancellationToken cancellationToken)
    {
        var desired = teacherIds.Where(x => x > 0).Distinct().ToHashSet();
        var existing = course.CourseTeachers.Select(x => x.TeacherId).ToHashSet();

        foreach (var link in course.CourseTeachers.Where(x => !desired.Contains(x.TeacherId)).ToList())
            course.CourseTeachers.Remove(link);

        foreach (var teacherId in desired.Where(x => !existing.Contains(x)))
        {
            await EnsureTeacherExistsAsync(teacherId, cancellationToken);
            course.CourseTeachers.Add(new CourseTeacher { TeacherId = teacherId });
        }
    }

    private async Task SyncStudentsAsync(Course course, List<int> studentIds, CancellationToken cancellationToken)
    {
        var desired = studentIds.Where(x => x > 0).Distinct().ToHashSet();
        var existing = course.Enrollments.Select(x => x.UserId).ToHashSet();

        foreach (var enrollment in course.Enrollments.Where(x => !desired.Contains(x.UserId)).ToList())
            course.Enrollments.Remove(enrollment);

        foreach (var studentId in desired.Where(x => !existing.Contains(x)))
        {
            await EnsureStudentExistsAsync(studentId, cancellationToken);
            course.Enrollments.Add(new Enrollment { UserId = studentId });
        }
    }

    private async Task EnsureTeacherExistsAsync(int teacherId, CancellationToken cancellationToken)
    {
        var teacher = await _userRepository.GetByIdAsync(teacherId, cancellationToken)
            ?? throw new NotFoundException("Teacher not found.");

        if (teacher.Role != Role.Teacher)
            throw new BusinessException("Selected user is not a teacher.");
    }

    private async Task EnsureStudentExistsAsync(int studentId, CancellationToken cancellationToken)
    {
        var student = await _userRepository.GetByIdAsync(studentId, cancellationToken)
            ?? throw new NotFoundException("Student not found.");

        if (student.Role != Role.Student)
            throw new BusinessException("Selected user is not a student.");
    }

    private void EnsureAdmin()
    {
        if (!_currentUserService.IsAdmin)
            throw new ForbiddenAccessException("Only admins can manage courses.");
    }

    private static CourseDto ToDto(Course course)
    {
        return new CourseDto
        {
            Id = course.Id,
            Name = course.Name,
            Subject = course.Subject,
            Program = course.Program,
            Department = course.Department,
            Session = course.Session,
            IsActive = course.IsActive,
            TeacherId = course.TeacherId,
            TeacherName = course.Teacher?.Name,
            TeacherIds = course.CourseTeachers.Select(x => x.TeacherId).ToList(),
            TeacherNames = course.CourseTeachers.Select(x => x.Teacher?.Name ?? string.Empty).ToList(),
            StudentIds = course.Enrollments.Select(x => x.UserId).ToList(),
            StudentCount = course.Enrollments.Count
        };
    }
}
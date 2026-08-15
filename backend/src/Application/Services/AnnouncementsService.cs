using eClassroomPro.Application.DTOs.Announcements;
using eClassroomPro.Application.Exceptions;
using eClassroomPro.Application.Interfaces;
using eClassroomPro.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace eClassroomPro.Application.Services;

public class AnnouncementsService
{
    private readonly IApplicationDbContext _db;
    private readonly ICourseRepository _courseRepository;
    private readonly ICurrentUserService _currentUserService;
    private readonly IDateTimeProvider _dateTimeProvider;
    private readonly IUnitOfWork _unitOfWork;

    public AnnouncementsService(
        IApplicationDbContext db,
        ICourseRepository courseRepository,
        ICurrentUserService currentUserService,
        IDateTimeProvider dateTimeProvider,
        IUnitOfWork unitOfWork)
    {
        _db = db;
        _courseRepository = courseRepository;
        _currentUserService = currentUserService;
        _dateTimeProvider = dateTimeProvider;
        _unitOfWork = unitOfWork;
    }

    public async Task<IReadOnlyList<AnnouncementDto>> GetForCourseAsync(
        int courseId,
        CancellationToken cancellationToken = default)
    {
        if (_currentUserService.UserId is null)
        {
            throw new UnauthorizedAccessException("User identity not found.");
        }

        var course = await _courseRepository.GetByIdAsync(courseId, cancellationToken)
            ?? throw new NotFoundException("Course not found.");

        EnsureCanView(course);

        var announcements = await _db.Announcements
            .AsNoTracking()
            .Include(x => x.CreatedBy)
            .Where(x => x.CourseId == courseId)
            .OrderByDescending(x => x.CreatedAtUtc)
            .ToListAsync(cancellationToken);

        return announcements.Select(ToDto).ToList();
    }

    public async Task<int> CreateAsync(CreateAnnouncementDto dto, CancellationToken cancellationToken = default)
    {
        if (!_currentUserService.IsTeacher && !_currentUserService.IsAdmin)
        {
            throw new ForbiddenAccessException("Only teachers or admins can post announcements.");
        }

        if (_currentUserService.UserId is null)
        {
            throw new UnauthorizedAccessException("User identity not found.");
        }

        if (string.IsNullOrWhiteSpace(dto.Body))
        {
            throw new ValidationException("Announcement body is required.");
        }

        var course = await _courseRepository.GetByIdAsync(dto.CourseId, cancellationToken)
            ?? throw new NotFoundException("Course not found.");

        EnsureCanManageCourse(course);

        var announcement = new Announcement
        {
            CourseId = course.Id,
            CreatedById = _currentUserService.UserId.Value,
            Body = dto.Body.Trim()
        };

        await _db.Announcements.AddAsync(announcement, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return announcement.Id;
    }

    public async Task DeleteAsync(int id, CancellationToken cancellationToken = default)
    {
        if (!_currentUserService.IsTeacher && !_currentUserService.IsAdmin)
        {
            throw new ForbiddenAccessException("Only teachers or admins can delete announcements.");
        }

        if (_currentUserService.UserId is null)
        {
            throw new UnauthorizedAccessException("User identity not found.");
        }

        var announcement = await _db.Announcements
            .FirstOrDefaultAsync(x => x.Id == id, cancellationToken)
            ?? throw new NotFoundException("Announcement not found.");

        var isCreator = announcement.CreatedById == _currentUserService.UserId.Value;
        if (!_currentUserService.IsAdmin && !isCreator)
        {
            throw new ForbiddenAccessException("You can only delete your own announcements.");
        }

        _db.Announcements.Remove(announcement);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }

    private void EnsureCanView(Course course)
    {
        if (_currentUserService.IsAdmin)
        {
            return;
        }

        var userId = _currentUserService.UserId!.Value;

        if (_currentUserService.IsTeacher)
        {
            var isTeacher = course.TeacherId == userId ||
                course.CourseTeachers.Any(x => x.TeacherId == userId);
            if (isTeacher)
            {
                return;
            }
        }

        if (_currentUserService.IsStudent)
        {
            var isEnrolled = course.Enrollments.Any(x => x.UserId == userId);
            if (isEnrolled)
            {
                return;
            }
        }

        throw new ForbiddenAccessException("You do not have access to this course.");
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

        var isTeacher = course.TeacherId == _currentUserService.UserId ||
            course.CourseTeachers.Any(x => x.TeacherId == _currentUserService.UserId);

        if (!isTeacher)
        {
            throw new ForbiddenAccessException("You do not have permission to manage this course.");
        }
    }

    private static AnnouncementDto ToDto(Announcement announcement) => new()
    {
        Id = announcement.Id,
        CourseId = announcement.CourseId,
        Body = announcement.Body,
        CreatedById = announcement.CreatedById,
        CreatedByName = announcement.CreatedBy?.Name,
        CreatedAtUtc = announcement.CreatedAtUtc
    };
}
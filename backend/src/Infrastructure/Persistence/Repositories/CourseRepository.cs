using eClassroomPro.Application.Interfaces;
using eClassroomPro.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace eClassroomPro.Infrastructure.Persistence.Repositories;

public class CourseRepository : ICourseRepository
{
    private readonly ApplicationDbContext _context;

    public CourseRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    // Tracked on purpose so UpdateAsync/DeleteAsync can mutate navigations.
    public async Task<Course?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        return await _context.Courses
            .Include(x => x.Teacher)
            .Include(x => x.CourseTeachers).ThenInclude(x => x.Teacher)
            .Include(x => x.Enrollments)
            .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
    }

    public async Task<Course?> GetByIdWithDetailsAsync(int id, CancellationToken cancellationToken = default)
    {
        return await _context.Courses
            .AsNoTracking()
            .Include(x => x.Teacher)
            .Include(x => x.CourseTeachers).ThenInclude(x => x.Teacher)
            .Include(x => x.Enrollments)
            .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
    }

    public async Task<IReadOnlyList<Course>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await _context.Courses
            .AsNoTracking()
            .Include(x => x.Teacher)
            .Include(x => x.CourseTeachers).ThenInclude(x => x.Teacher)
            .Include(x => x.Enrollments)
            .OrderBy(x => x.Name)
            .ToListAsync(cancellationToken);
    }

    public async Task<bool> IsStudentEnrolledAsync(int courseId, int studentId, CancellationToken cancellationToken = default)
    {
        return await _context.Enrollments
            .AsNoTracking()
            .AnyAsync(x => x.CourseId == courseId && x.UserId == studentId, cancellationToken);
    }

    public async Task EnrollStudentAsync(int courseId, int studentId, CancellationToken cancellationToken = default)
    {
        var enrollment = new Enrollment
        {
            CourseId = courseId,
            UserId = studentId
        };

        await _context.Enrollments.AddAsync(enrollment, cancellationToken);
    }

    public async Task AddAsync(Course course, CancellationToken cancellationToken = default)
    {
        await _context.Courses.AddAsync(course, cancellationToken);
    }

    public void Update(Course course)
    {
        _context.Courses.Update(course);
    }

    public void Remove(Course course)
    {
        _context.Courses.Remove(course);
    }
}
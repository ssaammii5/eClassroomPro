// backend/src/Infrastructure/Persistence/Repositories/AssignmentRepository.cs
using eClassroomPro.Application.Interfaces;
using eClassroomPro.Domain.Entities;
using eClassroomPro.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace eClassroomPro.Infrastructure.Persistence.Repositories;

public class AssignmentRepository : IAssignmentRepository
{
    private readonly ApplicationDbContext _context;
    public AssignmentRepository(ApplicationDbContext context) { _context = context; }

    public async Task<Assignment?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        return await _context.Assignments.AsNoTracking()
            .Include(x => x.Course).Include(x => x.CreatedBy).Include(x => x.Submissions).Include(x => x.Attachments)
            .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
    }

    public async Task<IReadOnlyList<Assignment>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await _context.Assignments.AsNoTracking()
            .Include(x => x.Course).Include(x => x.CreatedBy).Include(x => x.Submissions).Include(x => x.Attachments)
            .OrderByDescending(x => x.DeadlineUtc).ToListAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<Assignment>> GetForTeacherAsync(int teacherId, CancellationToken cancellationToken = default)
    {
        return await _context.Assignments.AsNoTracking()
            .Include(x => x.Course).Include(x => x.CreatedBy).Include(x => x.Submissions).Include(x => x.Attachments)
            .Where(x => x.CreatedById == teacherId || x.Course!.TeacherId == teacherId || x.Course!.CourseTeachers.Any(ct => ct.TeacherId == teacherId))
            .OrderByDescending(x => x.DeadlineUtc).ToListAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<Assignment>> GetPublishedForStudentAsync(int studentId, CancellationToken cancellationToken = default)
    {
        return await _context.Assignments.AsNoTracking()
            .Include(x => x.Course).Include(x => x.CreatedBy).Include(x => x.Attachments)
            .Where(x => x.Status == AssignmentStatus.Published)
            .Where(x => x.Course!.Enrollments.Any(e => e.UserId == studentId))
            .OrderByDescending(x => x.DeadlineUtc).ToListAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<Assignment>> GetForCourseAsync(int courseId, CancellationToken cancellationToken = default)
    {
        return await _context.Assignments.AsNoTracking()
            .Include(x => x.Course).Include(x => x.CreatedBy).Include(x => x.Submissions).Include(x => x.Attachments)
            .Where(x => x.CourseId == courseId).OrderByDescending(x => x.DeadlineUtc).ToListAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<Assignment>> GetPublishedForCourseAsync(int courseId, CancellationToken cancellationToken = default)
    {
        return await _context.Assignments.AsNoTracking()
            .Include(x => x.Course).Include(x => x.CreatedBy).Include(x => x.Attachments)
            .Where(x => x.CourseId == courseId && x.Status == AssignmentStatus.Published)
            .OrderByDescending(x => x.DeadlineUtc).ToListAsync(cancellationToken);
    }

    public async Task<bool> AnySubmittedAsync(int assignmentId, CancellationToken cancellationToken = default)
    {
        return await _context.Submissions.AsNoTracking()
            .AnyAsync(x => x.AssignmentId == assignmentId && (x.Status == SubmissionStatus.Submitted || x.Status == SubmissionStatus.Graded), cancellationToken);
    }

    public async Task AddAsync(Assignment assignment, CancellationToken cancellationToken = default) => await _context.Assignments.AddAsync(assignment, cancellationToken);
    public void Update(Assignment assignment) => _context.Assignments.Update(assignment);
    public void Remove(Assignment assignment) => _context.Assignments.Remove(assignment);
}
using eClassroomPro.Application.Interfaces;
using eClassroomPro.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace eClassroomPro.Infrastructure.Persistence.Repositories;

public class SubmissionRepository : ISubmissionRepository
{
    private readonly ApplicationDbContext _context;

    public SubmissionRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Submission?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        return await _context.Submissions
            .AsNoTracking()
            .Include(x => x.Assignment)
            .Include(x => x.Student)
            .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
    }

    public async Task<Submission?> GetByIdWithAssignmentAsync(int id, CancellationToken cancellationToken = default)
    {
        return await _context.Submissions
            .AsNoTracking()
            .Include(x => x.Assignment!)
                .ThenInclude(x => x.Course)
            .Include(x => x.Assignment!)
                .ThenInclude(x => x.Course!.CourseTeachers)
            .Include(x => x.Student)
            .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
    }

    public async Task<Submission?> GetByAssignmentAndStudentAsync(
        int assignmentId,
        int studentId,
        CancellationToken cancellationToken = default)
    {
        return await _context.Submissions
            .Include(x => x.Assignment)
            .Include(x => x.Student)
            .FirstOrDefaultAsync(
                x => x.AssignmentId == assignmentId && x.StudentId == studentId,
                cancellationToken);
    }

    public async Task<IReadOnlyList<Submission>> GetByAssignmentAsync(int assignmentId, CancellationToken cancellationToken = default)
    {
        return await _context.Submissions
            .AsNoTracking()
            .Include(x => x.Student)
            .Where(x => x.AssignmentId == assignmentId)
            .OrderBy(x => x.Student!.Name)
            .ToListAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<Submission>> GetByStudentAsync(int studentId, CancellationToken cancellationToken = default)
    {
        return await _context.Submissions
            .AsNoTracking()
            .Include(x => x.Assignment)
            .Include(x => x.Student)
            .Where(x => x.StudentId == studentId)
            .OrderByDescending(x => x.SubmittedAtUtc)
            .ToListAsync(cancellationToken);
    }

    public async Task AddAsync(Submission submission, CancellationToken cancellationToken = default)
    {
        await _context.Submissions.AddAsync(submission, cancellationToken);
    }

    public void Update(Submission submission)
    {
        _context.Submissions.Update(submission);
    }

    public void Remove(Submission submission)
    {
        _context.Submissions.Remove(submission);
    }
}
using eClassroomPro.Domain.Entities;

namespace eClassroomPro.Application.Interfaces;

public interface ISubmissionRepository
{
    Task<Submission?> GetByIdAsync(int id, CancellationToken cancellationToken = default);
    Task<Submission?> GetByIdWithAssignmentAsync(int id, CancellationToken cancellationToken = default);
    Task<Submission?> GetByIdWithFullDetailAsync(int id, CancellationToken cancellationToken = default);
    Task<Submission?> GetByAssignmentAndStudentAsync(
        int assignmentId,
        int studentId,
        CancellationToken cancellationToken = default);
    Task<IReadOnlyList<Submission>> GetByAssignmentAsync(int assignmentId, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<Submission>> GetByStudentAsync(int studentId, CancellationToken cancellationToken = default);
    Task AddAsync(Submission submission, CancellationToken cancellationToken = default);
    void Update(Submission submission);
    void Remove(Submission submission);
}
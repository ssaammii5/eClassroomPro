using eClassroomPro.Domain.Entities;

namespace eClassroomPro.Application.Interfaces;

public interface IAssignmentRepository
{
    Task<Assignment?> GetByIdAsync(int id, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<Assignment>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<IReadOnlyList<Assignment>> GetForTeacherAsync(int teacherId, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<Assignment>> GetPublishedForStudentAsync(int studentId, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<Assignment>> GetForCourseAsync(int courseId, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<Assignment>> GetPublishedForCourseAsync(int courseId, CancellationToken cancellationToken = default);
    Task<bool> AnySubmittedAsync(int assignmentId, CancellationToken cancellationToken = default);
    Task AddAsync(Assignment assignment, CancellationToken cancellationToken = default);
    void Update(Assignment assignment);
    void Remove(Assignment assignment);
}
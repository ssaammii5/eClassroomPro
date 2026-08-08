using eClassroomPro.Domain.Entities;

namespace eClassroomPro.Application.Interfaces;

public interface ICourseRepository
{
    Task<Course?> GetByIdAsync(int id, CancellationToken cancellationToken = default);

    Task<IReadOnlyList<Course>> GetAllAsync(CancellationToken cancellationToken = default);

    Task<bool> IsStudentEnrolledAsync(int courseId, int studentId, CancellationToken cancellationToken = default);

    Task EnrollStudentAsync(int courseId, int studentId, CancellationToken cancellationToken = default);

    Task AddAsync(Course course, CancellationToken cancellationToken = default);

    void Update(Course course);

    void Remove(Course course);
}
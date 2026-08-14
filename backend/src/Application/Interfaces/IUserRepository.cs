using eClassroomPro.Domain.Entities;

namespace eClassroomPro.Application.Interfaces;

public interface IUserRepository
{
    Task<User?> GetByIdAsync(int id, CancellationToken cancellationToken = default);
    Task<User?> GetByEmailAsync(string email, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<User>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<bool> ExistsByEmailAsync(string email, CancellationToken cancellationToken = default);
    Task AddAsync(User user, CancellationToken cancellationToken = default);
    void Update(User user);
    void Remove(User user);

    Task<StudentDetails?> GetStudentDetailsByUserIdAsync(int userId, CancellationToken cancellationToken = default);
    Task<TeacherDetails?> GetTeacherDetailsByUserIdAsync(int userId, CancellationToken cancellationToken = default);
    Task AddStudentDetailsAsync(StudentDetails details, CancellationToken cancellationToken = default);
    Task AddTeacherDetailsAsync(TeacherDetails details, CancellationToken cancellationToken = default);
    void RemoveStudentDetails(StudentDetails details);
    void RemoveTeacherDetails(TeacherDetails details);
}
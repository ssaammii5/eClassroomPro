using eClassroomPro.Application.Interfaces;
using eClassroomPro.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace eClassroomPro.Infrastructure.Persistence.Repositories;

public class UserRepository : IUserRepository
{
    private readonly ApplicationDbContext _context;

    public UserRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<User?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        return await _context.Users
            .AsNoTracking()
            .Include(x => x.StudentDetails)
            .Include(x => x.TeacherDetails)
            .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
    }

    public async Task<User?> GetByEmailAsync(string email, CancellationToken cancellationToken = default)
    {
        var normalizedEmail = email.Trim().ToLowerInvariant();

        return await _context.Users
            .AsNoTracking()
            .Include(x => x.StudentDetails)
            .Include(x => x.TeacherDetails)
            .FirstOrDefaultAsync(x => x.Email.ToLower() == normalizedEmail, cancellationToken);
    }

    public async Task<IReadOnlyList<User>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await _context.Users
            .AsNoTracking()
            .Include(x => x.StudentDetails)
            .Include(x => x.TeacherDetails)
            .OrderBy(x => x.Name)
            .ToListAsync(cancellationToken);
    }

    public async Task<bool> ExistsByEmailAsync(string email, CancellationToken cancellationToken = default)
    {
        var normalizedEmail = email.Trim().ToLowerInvariant();

        return await _context.Users
            .AsNoTracking()
            .AnyAsync(x => x.Email.ToLower() == normalizedEmail, cancellationToken);
    }

    public async Task AddAsync(User user, CancellationToken cancellationToken = default)
    {
        await _context.Users.AddAsync(user, cancellationToken);
    }

    public void Update(User user)
    {
        _context.Users.Update(user);
    }

    public void Remove(User user)
    {
        _context.Users.Remove(user);
    }

    public async Task<StudentDetails?> GetStudentDetailsByUserIdAsync(int userId, CancellationToken cancellationToken = default)
    {
        return await _context.StudentDetails
            .FirstOrDefaultAsync(x => x.UserId == userId, cancellationToken);
    }

    public async Task<TeacherDetails?> GetTeacherDetailsByUserIdAsync(int userId, CancellationToken cancellationToken = default)
    {
        return await _context.TeacherDetails
            .FirstOrDefaultAsync(x => x.UserId == userId, cancellationToken);
    }

    public async Task AddStudentDetailsAsync(StudentDetails details, CancellationToken cancellationToken = default)
    {
        await _context.StudentDetails.AddAsync(details, cancellationToken);
    }

    public async Task AddTeacherDetailsAsync(TeacherDetails details, CancellationToken cancellationToken = default)
    {
        await _context.TeacherDetails.AddAsync(details, cancellationToken);
    }

    public void RemoveStudentDetails(StudentDetails details)
    {
        _context.StudentDetails.Remove(details);
    }

    public void RemoveTeacherDetails(TeacherDetails details)
    {
        _context.TeacherDetails.Remove(details);
    }
}
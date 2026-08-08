namespace eClassroomPro.Application.Interfaces;

public interface ICurrentUserService
{
    int? UserId { get; }

    string? Email { get; }

    bool IsAdmin { get; }

    bool IsTeacher { get; }

    bool IsStudent { get; }
}
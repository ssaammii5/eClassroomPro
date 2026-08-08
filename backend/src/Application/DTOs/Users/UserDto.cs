using eClassroomPro.Domain.Enums;

namespace eClassroomPro.Application.DTOs.Users;

public class UserDto
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public Role Role { get; set; }

    public bool IsActive { get; set; }

    public DateTime CreatedAtUtc { get; set; }
}
using eClassroomPro.Domain.Enums;

namespace eClassroomPro.Application.DTOs.Users;

public class CreateUserDto
{
    public string Name { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string Password { get; set; } = string.Empty;

    public Role Role { get; set; }
}
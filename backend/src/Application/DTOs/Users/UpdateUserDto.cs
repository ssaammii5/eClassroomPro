using eClassroomPro.Domain.Enums;

namespace eClassroomPro.Application.DTOs.Users;

public class UpdateUserDto
{
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public Role Role { get; set; }
    public bool IsActive { get; set; }
    public string? Password { get; set; }
    public StudentDetailsDto? StudentDetails { get; set; }
    public TeacherDetailsDto? TeacherDetails { get; set; }
}
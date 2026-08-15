using System.ComponentModel.DataAnnotations;
using eClassroomPro.Domain.Enums;

namespace eClassroomPro.Application.DTOs.Users;

public class UpdateUserDto
{
    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    [MaxLength(200)]
    public string Email { get; set; } = string.Empty;

    public Role Role { get; set; }

    public bool IsActive { get; set; }

    // Optional — only validated when provided.
    [MinLength(8)]
    public string? Password { get; set; }

    public StudentDetailsDto? StudentDetails { get; set; }

    public TeacherDetailsDto? TeacherDetails { get; set; }
}
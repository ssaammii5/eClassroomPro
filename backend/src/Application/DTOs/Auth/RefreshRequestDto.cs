using System.ComponentModel.DataAnnotations;

namespace eClassroomPro.Application.DTOs.Auth;

public class RefreshRequestDto
{
    [Required]
    public string RefreshToken { get; set; } = string.Empty;
}
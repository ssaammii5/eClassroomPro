// backend/src/Application/DTOs/Auth/MeResponseDto.cs
namespace eClassroomPro.Application.DTOs.Auth;

public class MeResponseDto
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string Role { get; set; } = string.Empty;
}
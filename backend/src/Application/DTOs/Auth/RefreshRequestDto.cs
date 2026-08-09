// backend/src/Application/DTOs/Auth/RefreshRequestDto.cs
namespace eClassroomPro.Application.DTOs.Auth;

public class RefreshRequestDto
{
    public string RefreshToken { get; set; } = string.Empty;
}
// backend/src/Application/DTOs/Auth/LoginResponseDto.cs
namespace eClassroomPro.Application.DTOs.Auth;

public class LoginResponseDto
{
    // Kept for backward compatibility
    public string Token { get; set; } = string.Empty;

    public string AccessToken { get; set; } = string.Empty;

    public DateTime AccessTokenExpiresAtUtc { get; set; }

    public string RefreshToken { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string Name { get; set; } = string.Empty;

    public string Role { get; set; } = string.Empty;
}
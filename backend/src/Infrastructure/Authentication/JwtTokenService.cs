// backend/src/Infrastructure/Authentication/JwtTokenService.cs
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using eClassroomPro.Application.Interfaces;
using eClassroomPro.Application.Options;
using eClassroomPro.Domain.Entities;
using Microsoft.IdentityModel.Tokens;

namespace eClassroomPro.Infrastructure.Authentication;

public class JwtTokenService : ITokenService
{
    private readonly JwtSettings _jwtSettings;
    private readonly IDateTimeProvider _dateTimeProvider;

    public JwtTokenService(
        JwtSettings jwtSettings,
        IDateTimeProvider dateTimeProvider)
    {
        _jwtSettings = jwtSettings;
        _dateTimeProvider = dateTimeProvider;
    }

    public (string AccessToken, DateTime ExpiresAtUtc) CreateAccessToken(User user)
    {
        // Removed MapOutboundClaims which doesn't exist in v8.x
        var tokenHandler = new JwtSecurityTokenHandler();

        var key = Encoding.UTF8.GetBytes(_jwtSettings.Secret);

        var expiresAtUtc = _dateTimeProvider.UtcNow.AddMinutes(_jwtSettings.ExpiresMinutes);

        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new(JwtRegisteredClaimNames.Email, user.Email),
            new("name", user.Name),
            new("role", user.Role.ToString()),
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = expiresAtUtc,
            Issuer = _jwtSettings.Issuer,
            Audience = _jwtSettings.Audience,
            SigningCredentials = new SigningCredentials(
                new SymmetricSecurityKey(key),
                SecurityAlgorithms.HmacSha256Signature)
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);

        return (tokenHandler.WriteToken(token), expiresAtUtc);
    }

    public string CreateRefreshToken()
    {
        var randomBytes = RandomNumberGenerator.GetBytes(64);

        return Convert.ToBase64String(randomBytes)
            .Replace('+', '-')
            .Replace('/', '_')
            .TrimEnd('=');
    }

    public string HashRefreshToken(string refreshToken)
    {
        var bytes = Encoding.UTF8.GetBytes(refreshToken);
        var hash = SHA256.HashData(bytes);

        return Convert.ToBase64String(hash);
    }
}
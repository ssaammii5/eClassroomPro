using eClassroomPro.Domain.Entities;

namespace eClassroomPro.Application.Interfaces;

public interface ITokenService
{
    (string AccessToken, DateTime ExpiresAtUtc) CreateAccessToken(User user);

    string CreateRefreshToken();

    string HashRefreshToken(string refreshToken);
}
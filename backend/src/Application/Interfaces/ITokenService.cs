using eClassroomPro.Domain.Entities;

namespace eClassroomPro.Application.Interfaces;

public interface ITokenService
{
    string CreateAccessToken(User user);
}
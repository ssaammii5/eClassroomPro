using System.Security.Claims;
using eClassroomPro.Application.Interfaces;

namespace eClassroomPro.API.Services;

public class CurrentUserService : ICurrentUserService
{
    private const string SubClaim = "sub";
    private const string EmailClaim = "email";
    private const string RoleClaim = "role";

    private readonly IHttpContextAccessor _httpContextAccessor;

    public CurrentUserService(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    public int? UserId
    {
        get
        {
            var value = GetClaimValue(SubClaim) ?? GetClaimValue(ClaimTypes.NameIdentifier);

            return int.TryParse(value, out var id) ? id : null;
        }
    }

    public string? Email =>
        GetClaimValue(EmailClaim) ?? GetClaimValue(ClaimTypes.Email);

    public bool IsAdmin => HasRole("Admin");

    public bool IsTeacher => HasRole("Teacher");

    public bool IsStudent => HasRole("Student");

    private bool HasRole(string role)
    {
        var user = _httpContextAccessor.HttpContext?.User;

        if (user is null)
        {
            return false;
        }

        return user.IsInRole(role) ||
               string.Equals(user.FindFirstValue(RoleClaim), role, StringComparison.OrdinalIgnoreCase);
    }

    private string? GetClaimValue(string type)
    {
        return _httpContextAccessor.HttpContext?.User?.FindFirstValue(type);
    }
}
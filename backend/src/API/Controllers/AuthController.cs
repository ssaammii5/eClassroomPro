using eClassroomPro.Application.DTOs.Auth;
using eClassroomPro.Application.Interfaces;
using eClassroomPro.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace eClassroomPro.API.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly AuthService _authService;
    private readonly ICurrentUserService _currentUserService;

    public AuthController(
        AuthService authService,
        ICurrentUserService currentUserService)
    {
        _authService = authService;
        _currentUserService = currentUserService;
    }

    [AllowAnonymous]
    [HttpPost("login")]
    [EnableRateLimiting("authentication")]
    public async Task<ActionResult<LoginResponseDto>> Login(
        LoginRequestDto request,
        CancellationToken cancellationToken)
    {
        var result = await _authService.LoginAsync(request, cancellationToken);
        return Ok(result);
    }

    [AllowAnonymous]
    [HttpPost("refresh")]
    [EnableRateLimiting("authentication")]
    public async Task<ActionResult<LoginResponseDto>> Refresh(
        RefreshRequestDto request,
        CancellationToken cancellationToken)
    {
        var result = await _authService.RefreshAsync(request, cancellationToken);
        return Ok(result);
    }

    [Authorize]
    [HttpPost("logout")]
    public async Task<IActionResult> Logout(CancellationToken cancellationToken)
    {
        if (_currentUserService.UserId is null)
        {
            return Unauthorized();
        }

        await _authService.RevokeAllForUserAsync(_currentUserService.UserId.Value, cancellationToken);

        return NoContent();
    }

    [Authorize]
    [HttpGet("me")]
    public async Task<ActionResult<MeResponseDto>> Me(CancellationToken cancellationToken)
    {
        if (_currentUserService.UserId is null)
        {
            return Unauthorized();
        }

        var result = await _authService.GetMeAsync(_currentUserService.UserId.Value, cancellationToken);

        return Ok(result);
    }
}
using eClassroomPro.Application.DTOs.Dashboard;
using eClassroomPro.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace eClassroomPro.API.Controllers;

[ApiController]
[Route("api/dashboard")]
[Authorize(Roles = "Admin")]
public class DashboardController : ControllerBase
{
    private readonly DashboardService _dashboardService;

    public DashboardController(DashboardService dashboardService)
    {
        _dashboardService = dashboardService;
    }

    [HttpGet("stats")]
    public async Task<ActionResult<DashboardStatsDto>> GetStats(CancellationToken cancellationToken)
    {
        var result = await _dashboardService.GetStatsAsync(cancellationToken);
        return Ok(result);
    }
}
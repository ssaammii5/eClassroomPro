using eClassroomPro.Application.DTOs.AppSettings;
using eClassroomPro.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace eClassroomPro.API.Controllers;

[ApiController]
[Route("api/app-settings")]
[Authorize(Roles = "Admin")]
public class AppSettingsController : ControllerBase
{
    private readonly AppSettingService _appSettingService;

    public AppSettingsController(AppSettingService appSettingService)
    {
        _appSettingService = appSettingService;
    }

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<AppSettingDto>>> GetAll(CancellationToken cancellationToken)
    {
        var result = await _appSettingService.GetAllAsync(cancellationToken);

        return Ok(result);
    }

    [HttpPut]
    public async Task<ActionResult<AppSettingDto>> Upsert(UpsertAppSettingDto dto, CancellationToken cancellationToken)
    {
        var result = await _appSettingService.UpsertAsync(dto, cancellationToken);

        return Ok(result);
    }
}
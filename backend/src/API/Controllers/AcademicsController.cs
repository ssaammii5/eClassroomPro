using eClassroomPro.Application.DTOs.Academics;
using eClassroomPro.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace eClassroomPro.API.Controllers;

[ApiController]
[Route("api/academics")]
[Authorize(Roles = "Admin")]
public class AcademicsController : ControllerBase
{
    private readonly AcademicsService _academicsService;

    public AcademicsController(AcademicsService academicsService)
    {
        _academicsService = academicsService;
    }

    // Programs
    [HttpGet("programs")]
    public async Task<ActionResult<List<AcademicProgramDto>>> GetPrograms(CancellationToken cancellationToken)
        => Ok(await _academicsService.GetProgramsAsync(cancellationToken));

    [HttpPost("programs")]
    public async Task<ActionResult<AcademicProgramDto>> CreateProgram(UpsertAcademicProgramDto dto, CancellationToken cancellationToken)
    {
        var result = await _academicsService.CreateProgramAsync(dto, cancellationToken);
        return Created($"/api/academics/programs/{result.Id}", result);
    }

    [HttpPut("programs/{id:int}")]
    public async Task<IActionResult> UpdateProgram(int id, UpsertAcademicProgramDto dto, CancellationToken cancellationToken)
    {
        await _academicsService.UpdateProgramAsync(id, dto, cancellationToken);
        return NoContent();
    }

    [HttpDelete("programs/{id:int}")]
    public async Task<IActionResult> DeleteProgram(int id, CancellationToken cancellationToken)
    {
        await _academicsService.DeleteProgramAsync(id, cancellationToken);
        return NoContent();
    }

    // Departments
    [HttpGet("departments")]
    public async Task<ActionResult<List<AcademicDepartmentDto>>> GetDepartments(CancellationToken cancellationToken)
        => Ok(await _academicsService.GetDepartmentsAsync(cancellationToken));

    [HttpPost("departments")]
    public async Task<ActionResult<AcademicDepartmentDto>> CreateDepartment(UpsertAcademicDepartmentDto dto, CancellationToken cancellationToken)
    {
        var result = await _academicsService.CreateDepartmentAsync(dto, cancellationToken);
        return Created($"/api/academics/departments/{result.Id}", result);
    }

    [HttpPut("departments/{id:int}")]
    public async Task<IActionResult> UpdateDepartment(int id, UpsertAcademicDepartmentDto dto, CancellationToken cancellationToken)
    {
        await _academicsService.UpdateDepartmentAsync(id, dto, cancellationToken);
        return NoContent();
    }

    [HttpDelete("departments/{id:int}")]
    public async Task<IActionResult> DeleteDepartment(int id, CancellationToken cancellationToken)
    {
        await _academicsService.DeleteDepartmentAsync(id, cancellationToken);
        return NoContent();
    }

    // Semesters
    [HttpGet("semesters")]
    public async Task<ActionResult<List<AcademicSemesterDto>>> GetSemesters(CancellationToken cancellationToken)
        => Ok(await _academicsService.GetSemestersAsync(cancellationToken));

    [HttpPost("semesters")]
    public async Task<ActionResult<AcademicSemesterDto>> CreateSemester(UpsertAcademicSemesterDto dto, CancellationToken cancellationToken)
    {
        var result = await _academicsService.CreateSemesterAsync(dto, cancellationToken);
        return Created($"/api/academics/semesters/{result.Id}", result);
    }

    [HttpPut("semesters/{id:int}")]
    public async Task<IActionResult> UpdateSemester(int id, UpsertAcademicSemesterDto dto, CancellationToken cancellationToken)
    {
        await _academicsService.UpdateSemesterAsync(id, dto, cancellationToken);
        return NoContent();
    }

    [HttpDelete("semesters/{id:int}")]
    public async Task<IActionResult> DeleteSemester(int id, CancellationToken cancellationToken)
    {
        await _academicsService.DeleteSemesterAsync(id, cancellationToken);
        return NoContent();
    }
}
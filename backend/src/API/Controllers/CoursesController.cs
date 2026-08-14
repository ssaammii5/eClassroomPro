using eClassroomPro.Application.DTOs.Courses;
using eClassroomPro.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace eClassroomPro.API.Controllers;

[ApiController]
[Route("api/courses")]
[Authorize]
public class CoursesController : ControllerBase
{
    private readonly CourseService _courseService;

    public CoursesController(CourseService courseService)
    {
        _courseService = courseService;
    }

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<CourseDto>>> GetAll(CancellationToken cancellationToken)
    {
        var result = await _courseService.GetAllAsync(cancellationToken);
        return Ok(result);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<CourseDto>> GetById(int id, CancellationToken cancellationToken)
    {
        var result = await _courseService.GetByIdAsync(id, cancellationToken);
        return Ok(result);
    }

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<ActionResult<CourseDto>> Create(CreateCourseDto dto, CancellationToken cancellationToken)
    {
        var result = await _courseService.CreateAsync(dto, cancellationToken);
        return Created($"/api/courses/{result.Id}", result);
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, UpdateCourseDto dto, CancellationToken cancellationToken)
    {
        await _courseService.UpdateAsync(id, dto, cancellationToken);
        return NoContent();
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
    {
        await _courseService.DeleteAsync(id, cancellationToken);
        return NoContent();
    }
}
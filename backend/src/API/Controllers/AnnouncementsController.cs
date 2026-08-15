using eClassroomPro.Application.DTOs.Announcements;
using eClassroomPro.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace eClassroomPro.API.Controllers;

[ApiController]
[Route("api/announcements")]
[Authorize]
public class AnnouncementsController : ControllerBase
{
    private readonly AnnouncementsService _announcementsService;

    public AnnouncementsController(AnnouncementsService announcementsService)
    {
        _announcementsService = announcementsService;
    }

    [HttpGet("/api/courses/{courseId:int}/announcements")]
    public async Task<ActionResult<IReadOnlyList<AnnouncementDto>>> GetForCourse(
        int courseId,
        CancellationToken cancellationToken)
    {
        var result = await _announcementsService.GetForCourseAsync(courseId, cancellationToken);
        return Ok(result);
    }

    [Authorize(Roles = "Admin,Teacher")]
    [HttpPost("/api/courses/{courseId:int}/announcements")]
    public async Task<IActionResult> Create(
        int courseId,
        [FromBody] CreateAnnouncementDto dto,
        CancellationToken cancellationToken)
    {
        dto.CourseId = courseId;
        var id = await _announcementsService.CreateAsync(dto, cancellationToken);
        return Created($"/api/announcements/{id}", new { id });
    }

    [Authorize(Roles = "Admin,Teacher")]
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
    {
        await _announcementsService.DeleteAsync(id, cancellationToken);
        return NoContent();
    }
}
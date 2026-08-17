// backend/src/API/Controllers/AssignmentsController.cs
using eClassroomPro.Application.DTOs.Assignments;
using eClassroomPro.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;

namespace eClassroomPro.API.Controllers;

[ApiController]
[Route("api/assignments")]
[Authorize]
public class AssignmentsController : ControllerBase
{
    private readonly AssignmentService _assignmentService;
    public AssignmentsController(AssignmentService assignmentService) { _assignmentService = assignmentService; }

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<AssignmentDto>>> GetAll(CancellationToken cancellationToken) => Ok(await _assignmentService.GetAllForCurrentUserAsync(cancellationToken));

    [HttpGet("/api/courses/{courseId:int}/assignments")]
    public async Task<ActionResult<IReadOnlyList<AssignmentDto>>> GetForCourse(int courseId, CancellationToken cancellationToken) => Ok(await _assignmentService.GetForCourseAsync(courseId, cancellationToken));

    [HttpGet("{id:int}")]
    public async Task<ActionResult<AssignmentDto>> GetById(int id, CancellationToken cancellationToken) => Ok(await _assignmentService.GetByIdAsync(id, cancellationToken));

    [Authorize(Roles = "Admin,Teacher")]
    [HttpPost]
    public async Task<IActionResult> Create(CreateAssignmentDto dto, CancellationToken cancellationToken) { var id = await _assignmentService.CreateAsync(dto, cancellationToken); return Created($"/api/assignments/{id}", new { id }); }

    [Authorize(Roles = "Admin,Teacher")]
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, UpdateAssignmentDto dto, CancellationToken cancellationToken) { await _assignmentService.UpdateAsync(id, dto, cancellationToken); return NoContent(); }

    [Authorize(Roles = "Admin,Teacher")]
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken) { await _assignmentService.DeleteAsync(id, cancellationToken); return NoContent(); }

    [Authorize(Roles = "Admin,Teacher")]
    [HttpPost("{id:int}/publish")]
    public async Task<IActionResult> Publish(int id, CancellationToken cancellationToken) { await _assignmentService.PublishAsync(id, cancellationToken); return NoContent(); }

    [Authorize(Roles = "Admin,Teacher")]
    [HttpPost("{id:int}/attachments")]
    public async Task<IActionResult> UploadAttachment(int id, [FromForm] IFormFile? file, [FromForm] string? linkUrl, [FromForm] string? linkTitle, CancellationToken cancellationToken)
    {
        var result = await _assignmentService.AddAttachmentAsync(id, file, linkUrl, linkTitle, cancellationToken);
        return Ok(result);
    }

    [Authorize(Roles = "Admin,Teacher")]
    [HttpDelete("{id:int}/attachments/{attachmentId:int}")]
    public async Task<IActionResult> DeleteAttachment(int id, int attachmentId, CancellationToken cancellationToken)
    {
        await _assignmentService.DeleteAttachmentAsync(id, attachmentId, cancellationToken);
        return NoContent();
    }
}
// backend/src/API/Controllers/SubmissionsController.cs
using eClassroomPro.Application.DTOs.Submissions;
using eClassroomPro.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;

namespace eClassroomPro.API.Controllers;

[ApiController]
[Route("api/submissions")]
[Authorize]
public class SubmissionsController : ControllerBase
{
    private readonly SubmissionService _submissionService;
    public SubmissionsController(SubmissionService submissionService) { _submissionService = submissionService; }

    [Authorize(Roles = "Student")]
    [HttpPost]
    public async Task<ActionResult<SubmissionDto>> Submit(SubmitAssignmentDto dto, CancellationToken cancellationToken) => Ok(await _submissionService.SubmitAsync(dto, cancellationToken));

    [Authorize(Roles = "Student")]
    [HttpGet("my")]
    public async Task<ActionResult<IReadOnlyList<SubmissionDto>>> GetMySubmissions(CancellationToken cancellationToken) => Ok(await _submissionService.GetMySubmissionsAsync(cancellationToken));

    [Authorize(Roles = "Admin,Teacher")]
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<SubmissionDto>>> GetAll(CancellationToken cancellationToken) => Ok(await _submissionService.GetAllForAdminAsync(cancellationToken));

    [Authorize(Roles = "Admin,Teacher")]
    [HttpGet("{id:int}")]
    public async Task<ActionResult<SubmissionDto>> GetById(int id, CancellationToken cancellationToken) => Ok(await _submissionService.GetDetailAsync(id, cancellationToken));

    [Authorize(Roles = "Admin,Teacher")]
    [HttpGet("/api/assignments/{assignmentId:int}/submissions")]
    public async Task<ActionResult<IReadOnlyList<SubmissionDto>>> GetByAssignment(int assignmentId, CancellationToken cancellationToken) => Ok(await _submissionService.GetByAssignmentAsync(assignmentId, cancellationToken));

    [Authorize(Roles = "Admin,Teacher")]
    [HttpPost("{submissionId:int}/grade")]
    public async Task<ActionResult<SubmissionDto>> Grade(int submissionId, GradeSubmissionDto dto, CancellationToken cancellationToken) => Ok(await _submissionService.GradeAsync(submissionId, dto, cancellationToken));

    [Authorize(Roles = "Admin,Teacher")]
    [HttpPost("{submissionId:int}/status")]
    public async Task<ActionResult<SubmissionDto>> ChangeStatus(int submissionId, UpdateSubmissionStatusDto dto, CancellationToken cancellationToken) => Ok(await _submissionService.ChangeStatusAsync(submissionId, dto, cancellationToken));

    [Authorize(Roles = "Student,Admin,Teacher")]
    [HttpPost("{submissionId:int}/attachments")]
    public async Task<IActionResult> UploadSubmissionAttachment(int submissionId, [FromForm] IFormFile? file, [FromForm] string? linkUrl, [FromForm] string? linkTitle, CancellationToken cancellationToken)
    {
        var result = await _submissionService.AddSubmissionAttachmentAsync(submissionId, file, linkUrl, linkTitle, cancellationToken);
        return Ok(result);
    }

    [Authorize(Roles = "Student,Admin,Teacher")]
    [HttpDelete("{submissionId:int}/attachments/{attachmentId:int}")]
    public async Task<IActionResult> DeleteSubmissionAttachment(int submissionId, int attachmentId, CancellationToken cancellationToken)
    {
        await _submissionService.DeleteSubmissionAttachmentAsync(submissionId, attachmentId, cancellationToken);
        return NoContent();
    }
}
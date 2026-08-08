using eClassroomPro.Application.DTOs.Submissions;
using eClassroomPro.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace eClassroomPro.API.Controllers;

[ApiController]
[Route("api/submissions")]
[Authorize]
public class SubmissionsController : ControllerBase
{
    private readonly SubmissionService _submissionService;

    public SubmissionsController(SubmissionService submissionService)
    {
        _submissionService = submissionService;
    }

    [Authorize(Roles = "Student")]
    [HttpPost]
    public async Task<ActionResult<SubmissionDto>> Submit(SubmitAssignmentDto dto, CancellationToken cancellationToken)
    {
        var result = await _submissionService.SubmitAsync(dto, cancellationToken);

        return Ok(result);
    }

    [Authorize(Roles = "Student")]
    [HttpGet("my")]
    public async Task<ActionResult<IReadOnlyList<SubmissionDto>>> GetMySubmissions(CancellationToken cancellationToken)
    {
        var result = await _submissionService.GetMySubmissionsAsync(cancellationToken);

        return Ok(result);
    }

    [Authorize(Roles = "Admin,Teacher")]
    [HttpGet("/api/assignments/{assignmentId:int}/submissions")]
    public async Task<ActionResult<IReadOnlyList<SubmissionDto>>> GetByAssignment(
        int assignmentId,
        CancellationToken cancellationToken)
    {
        var result = await _submissionService.GetByAssignmentAsync(assignmentId, cancellationToken);

        return Ok(result);
    }

    [Authorize(Roles = "Admin,Teacher")]
    [HttpPost("{submissionId:int}/grade")]
    public async Task<ActionResult<SubmissionDto>> Grade(
        int submissionId,
        GradeSubmissionDto dto,
        CancellationToken cancellationToken)
    {
        var result = await _submissionService.GradeAsync(submissionId, dto, cancellationToken);

        return Ok(result);
    }

    [Authorize(Roles = "Admin,Teacher")]
    [HttpPost("{submissionId:int}/status")]
    public async Task<ActionResult<SubmissionDto>> ChangeStatus(
        int submissionId,
        UpdateSubmissionStatusDto dto,
        CancellationToken cancellationToken)
    {
        var result = await _submissionService.ChangeStatusAsync(submissionId, dto, cancellationToken);

        return Ok(result);
    }
}
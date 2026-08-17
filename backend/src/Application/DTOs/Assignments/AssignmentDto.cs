// backend/src/Application/DTOs/Assignments/AssignmentDto.cs
using eClassroomPro.Domain.Enums;

namespace eClassroomPro.Application.DTOs.Assignments;

public class AssignmentDto
{
    public int Id { get; set; }
    public int CourseId { get; set; }
    public string? CourseName { get; set; }
    public string? Subject { get; set; }
    public string? Program { get; set; }
    public string? Department { get; set; }
    public string? Session { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Topic { get; set; } = string.Empty;
    public AssignmentKind Kind { get; set; }
    public DateTime DeadlineUtc { get; set; }
    public int MaxMarks { get; set; }
    public AssignmentStatus Status { get; set; }
    public int CreatedById { get; set; }
    public string? CreatedByName { get; set; }
    public DateTime CreatedAtUtc { get; set; }
    public int SubmissionCount { get; set; }
    public string? MySubmissionStatus { get; set; }
    public List<AssignmentAttachmentDto> Attachments { get; set; } = new();
}
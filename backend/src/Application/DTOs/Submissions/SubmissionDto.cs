using eClassroomPro.Domain.Enums;

namespace eClassroomPro.Application.DTOs.Submissions;

public class SubmissionDto
{
    public int Id { get; set; }

    public int AssignmentId { get; set; }

    public string? AssignmentTitle { get; set; }

    public int StudentId { get; set; }

    public string? StudentName { get; set; }

    public string Answer { get; set; } = string.Empty;

    public SubmissionStatus Status { get; set; }

    public decimal? Marks { get; set; }

    public string? Feedback { get; set; }

    public DateTime? SubmittedAtUtc { get; set; }

    public DateTime CreatedAtUtc { get; set; }
}
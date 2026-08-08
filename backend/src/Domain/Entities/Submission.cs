using eClassroomPro.Domain.Common;
using eClassroomPro.Domain.Enums;

namespace eClassroomPro.Domain.Entities;

public class Submission : BaseEntity
{
    public int AssignmentId { get; set; }

    public Assignment? Assignment { get; set; }

    public int StudentId { get; set; }

    public User? Student { get; set; }

    public string Answer { get; set; } = string.Empty;

    public SubmissionStatus Status { get; set; } = SubmissionStatus.Draft;

    public decimal? Marks { get; set; }

    public string? Feedback { get; set; }

    public DateTime? SubmittedAtUtc { get; set; }

    public bool IsGraded => Status == SubmissionStatus.Graded;
}
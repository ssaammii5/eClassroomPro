using eClassroomPro.Domain.Enums;

namespace eClassroomPro.Application.DTOs.Submissions;

public class SubmissionDto
{
    public int Id { get; set; }
    public int AssignmentId { get; set; }
    public string? AssignmentTitle { get; set; }

    // Course context (denormalized so the admin list can group without extra lookups)
    public int CourseId { get; set; }
    public string? CourseName { get; set; }
    public string? Program { get; set; }
    public string? Department { get; set; }
    public string? Session { get; set; }

    // Student context
    public int StudentId { get; set; }
    public string? StudentName { get; set; }
    public string? StudentEmail { get; set; }
    public string? StudentAcademicId { get; set; }
    public string? StudentDepartment { get; set; }
    public string? StudentProgram { get; set; }

    public string Answer { get; set; } = string.Empty;
    public SubmissionStatus Status { get; set; }
    public decimal? Marks { get; set; }
    public string? Feedback { get; set; }
    public DateTime? SubmittedAtUtc { get; set; }
    public DateTime CreatedAtUtc { get; set; }

    // Grading audit
    public int? GradedById { get; set; }
    public string? GradedByName { get; set; }
    public DateTime? GradedAtUtc { get; set; }

    public bool IsLate { get; set; }
    public int MaxMarks { get; set; }

    public List<SubmissionAttachmentDto> Attachments { get; set; } = new();
    public List<SubmissionActivityDto> Activities { get; set; } = new();
}

public class SubmissionAttachmentDto
{
    public int Id { get; set; }
    public string FileName { get; set; } = string.Empty;
    public string FileType { get; set; } = string.Empty;
    public string FileSize { get; set; } = string.Empty;
    public DateTime UploadedAtUtc { get; set; }
    public string Kind { get; set; } = "file";
    public string? Url { get; set; }
}

public class SubmissionActivityDto
{
    public int Id { get; set; }
    public string Action { get; set; } = string.Empty;
    public string ActorName { get; set; } = string.Empty;
    public DateTime TimestampUtc { get; set; }
}
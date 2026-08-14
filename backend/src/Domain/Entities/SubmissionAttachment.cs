using eClassroomPro.Domain.Common;

namespace eClassroomPro.Domain.Entities;

public class SubmissionAttachment : BaseEntity
{
    public int SubmissionId { get; set; }
    public Submission? Submission { get; set; }

    public string FileName { get; set; } = string.Empty;
    public string FileType { get; set; } = string.Empty;
    public long FileSize { get; set; }
    public string StoredPath { get; set; } = string.Empty;
    public string Kind { get; set; } = "file"; // "file" | "link"
    public string? Url { get; set; }
}
using eClassroomPro.Domain.Common;

namespace eClassroomPro.Domain.Entities;

public class AssignmentAttachment : BaseEntity
{
    public int AssignmentId { get; set; }
    public Assignment? Assignment { get; set; }
    public string FileName { get; set; } = string.Empty;
    public string FileType { get; set; } = string.Empty;
    public long FileSize { get; set; }
    public string StoredPath { get; set; } = string.Empty;
    public string Kind { get; set; } = "file"; // "file" | "link"
    public string? Url { get; set; }
}
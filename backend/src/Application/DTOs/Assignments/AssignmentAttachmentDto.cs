// backend/src/Application/DTOs/Assignments/AssignmentAttachmentDto.cs
namespace eClassroomPro.Application.DTOs.Assignments;

public class AssignmentAttachmentDto
{
    public int Id { get; set; }
    public string FileName { get; set; } = string.Empty;
    public string FileType { get; set; } = string.Empty;
    public string FileSize { get; set; } = string.Empty;
    public DateTime UploadedAtUtc { get; set; }
    public string Kind { get; set; } = "file";
    public string? Url { get; set; }
}
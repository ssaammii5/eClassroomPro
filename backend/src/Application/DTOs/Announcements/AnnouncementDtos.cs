namespace eClassroomPro.Application.DTOs.Announcements;

public class AnnouncementDto
{
    public int Id { get; set; }
    public int CourseId { get; set; }
    public string Body { get; set; } = string.Empty;
    public int CreatedById { get; set; }
    public string? CreatedByName { get; set; }
    public DateTime CreatedAtUtc { get; set; }
}

public class CreateAnnouncementDto
{
    public int CourseId { get; set; }
    public string Body { get; set; } = string.Empty;
}
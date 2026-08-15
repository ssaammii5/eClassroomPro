using eClassroomPro.Domain.Common;

namespace eClassroomPro.Domain.Entities;

public class Announcement : BaseEntity
{
    public int CourseId { get; set; }
    public Course? Course { get; set; }

    public int CreatedById { get; set; }
    public User? CreatedBy { get; set; }

    public string Body { get; set; } = string.Empty;
}
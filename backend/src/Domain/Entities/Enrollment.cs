using eClassroomPro.Domain.Common;

namespace eClassroomPro.Domain.Entities;

public class Enrollment : BaseEntity
{
    public int UserId { get; set; }

    public User? User { get; set; }

    public int CourseId { get; set; }

    public Course? Course { get; set; }
}
using eClassroomPro.Domain.Common;

namespace eClassroomPro.Domain.Entities;

public class CourseTeacher : BaseEntity
{
    public int CourseId { get; set; }
    public Course? Course { get; set; }

    public int TeacherId { get; set; }
    public User? Teacher { get; set; }
}
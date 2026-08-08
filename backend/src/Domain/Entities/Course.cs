using eClassroomPro.Domain.Common;

namespace eClassroomPro.Domain.Entities;

public class Course : BaseEntity
{
    public string Name { get; set; } = string.Empty;

    public string Subject { get; set; } = string.Empty;

    public int? TeacherId { get; set; }

    public User? Teacher { get; set; }

    public ICollection<Assignment> Assignments { get; set; } = new List<Assignment>();

    public ICollection<Enrollment> Enrollments { get; set; } = new List<Enrollment>();
}
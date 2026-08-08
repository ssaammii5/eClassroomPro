using eClassroomPro.Domain.Common;
using eClassroomPro.Domain.Enums;

namespace eClassroomPro.Domain.Entities;

public class User : BaseEntity
{
    public string Name { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string PasswordHash { get; set; } = string.Empty;

    public Role Role { get; set; }

    public bool IsActive { get; set; } = true;

    public ICollection<Course> TaughtCourses { get; set; } = new List<Course>();

    public ICollection<Enrollment> Enrollments { get; set; } = new List<Enrollment>();

    public ICollection<Assignment> CreatedAssignments { get; set; } = new List<Assignment>();

    public ICollection<Submission> Submissions { get; set; } = new List<Submission>();
}
using eClassroomPro.Domain.Common;

namespace eClassroomPro.Domain.Entities;

public class Course : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Subject { get; set; } = string.Empty;

    public string Program { get; set; } = string.Empty;
    public string Department { get; set; } = string.Empty;
    public string Session { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;

    // Primary teacher kept for backward compatibility with existing queries.
    public int? TeacherId { get; set; }
    public User? Teacher { get; set; }

    // All assigned teachers (many-to-many).
    public ICollection<CourseTeacher> CourseTeachers { get; set; } = new List<CourseTeacher>();

    public ICollection<Assignment> Assignments { get; set; } = new List<Assignment>();
    public ICollection<Enrollment> Enrollments { get; set; } = new List<Enrollment>();
}
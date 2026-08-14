namespace eClassroomPro.Application.DTOs.Courses;

public class CourseDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Subject { get; set; } = string.Empty;
    public string Program { get; set; } = string.Empty;
    public string Department { get; set; } = string.Empty;
    public string Session { get; set; } = string.Empty;
    public bool IsActive { get; set; }

    public int? TeacherId { get; set; }
    public string? TeacherName { get; set; }

    public List<int> TeacherIds { get; set; } = new();
    public List<string> TeacherNames { get; set; } = new();
    public List<int> StudentIds { get; set; } = new();
    public int StudentCount { get; set; }
}
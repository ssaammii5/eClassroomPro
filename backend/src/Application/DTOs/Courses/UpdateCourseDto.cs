namespace eClassroomPro.Application.DTOs.Courses;

public class UpdateCourseDto
{
    public string Name { get; set; } = string.Empty;
    public string Subject { get; set; } = string.Empty;
    public string Program { get; set; } = string.Empty;
    public string Department { get; set; } = string.Empty;
    public string Session { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;
    public List<int> TeacherIds { get; set; } = new();
    public List<int> StudentIds { get; set; } = new();
}
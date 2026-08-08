namespace eClassroomPro.Application.DTOs.Courses;

public class CourseDto
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string Subject { get; set; } = string.Empty;

    public int? TeacherId { get; set; }

    public string? TeacherName { get; set; }

    public int StudentCount { get; set; }
}
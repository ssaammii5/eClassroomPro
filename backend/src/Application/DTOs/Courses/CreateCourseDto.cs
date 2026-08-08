namespace eClassroomPro.Application.DTOs.Courses;

public class CreateCourseDto
{
    public string Name { get; set; } = string.Empty;

    public string Subject { get; set; } = string.Empty;

    public int? TeacherId { get; set; }
}
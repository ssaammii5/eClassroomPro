namespace eClassroomPro.Application.DTOs.Courses;

public class CoursePersonDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty; // "Teacher" | "Student"
    public string Email { get; set; } = string.Empty;
}

public class CoursePeopleDto
{
    public List<CoursePersonDto> Teachers { get; set; } = new();
    public List<CoursePersonDto> Students { get; set; } = new();
}
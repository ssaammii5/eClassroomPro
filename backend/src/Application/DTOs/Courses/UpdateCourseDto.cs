using System.ComponentModel.DataAnnotations;

namespace eClassroomPro.Application.DTOs.Courses;

public class UpdateCourseDto
{
    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(200)]
    public string Subject { get; set; } = string.Empty;

    [MaxLength(200)]
    public string Program { get; set; } = string.Empty;

    [MaxLength(100)]
    public string Department { get; set; } = string.Empty;

    [MaxLength(100)]
    public string Session { get; set; } = string.Empty;

    public bool IsActive { get; set; } = true;

    public List<int> TeacherIds { get; set; } = new();

    public List<int> StudentIds { get; set; } = new();
}
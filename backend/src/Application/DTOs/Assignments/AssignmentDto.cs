using eClassroomPro.Domain.Enums;

namespace eClassroomPro.Application.DTOs.Assignments;

public class AssignmentDto
{
    public int Id { get; set; }

    public int CourseId { get; set; }

    public string? CourseName { get; set; }

    public string? Subject { get; set; }

    public string Title { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public DateTime DeadlineUtc { get; set; }

    public int MaxMarks { get; set; }

    public AssignmentStatus Status { get; set; }

    public int CreatedById { get; set; }

    public DateTime CreatedAtUtc { get; set; }
}
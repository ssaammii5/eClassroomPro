using eClassroomPro.Domain.Enums;

namespace eClassroomPro.Application.DTOs.Assignments;

public class CreateAssignmentDto
{
    public int CourseId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Topic { get; set; } = string.Empty;
    public AssignmentKind Kind { get; set; } = AssignmentKind.Assignment;
    public DateTime DeadlineUtc { get; set; }
    public int MaxMarks { get; set; }
}
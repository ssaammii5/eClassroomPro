namespace eClassroomPro.Application.DTOs.Assignments;

public class CreateAssignmentDto
{
    public int CourseId { get; set; }

    public string Title { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public DateTime DeadlineUtc { get; set; }

    public int MaxMarks { get; set; }
}
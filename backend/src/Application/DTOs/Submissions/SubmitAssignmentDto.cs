namespace eClassroomPro.Application.DTOs.Submissions;

public class SubmitAssignmentDto
{
    public int AssignmentId { get; set; }

    public string Answer { get; set; } = string.Empty;
}
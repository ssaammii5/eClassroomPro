using System.ComponentModel.DataAnnotations;

namespace eClassroomPro.Application.DTOs.Submissions;

public class SubmitAssignmentDto
{
    public int AssignmentId { get; set; }

    [Required]
    public string Answer { get; set; } = string.Empty;
}
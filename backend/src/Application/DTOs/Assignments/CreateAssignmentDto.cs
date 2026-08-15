using System.ComponentModel.DataAnnotations;
using eClassroomPro.Domain.Enums;

namespace eClassroomPro.Application.DTOs.Assignments;

public class CreateAssignmentDto
{
    public int CourseId { get; set; }

    [Required]
    [MaxLength(300)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(4000)]
    public string Description { get; set; } = string.Empty;

    [MaxLength(300)]
    public string Topic { get; set; } = string.Empty;

    public AssignmentKind Kind { get; set; } = AssignmentKind.Assignment;

    public DateTime DeadlineUtc { get; set; }

    [Range(1, int.MaxValue)]
    public int MaxMarks { get; set; }
}
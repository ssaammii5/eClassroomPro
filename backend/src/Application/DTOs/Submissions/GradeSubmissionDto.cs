using System.ComponentModel.DataAnnotations;

namespace eClassroomPro.Application.DTOs.Submissions;

public class GradeSubmissionDto
{
    [Range(0, double.MaxValue)]
    public decimal Marks { get; set; }

    public string? Feedback { get; set; }
}
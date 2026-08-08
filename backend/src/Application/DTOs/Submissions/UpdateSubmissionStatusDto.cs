using eClassroomPro.Domain.Enums;

namespace eClassroomPro.Application.DTOs.Submissions;

public class UpdateSubmissionStatusDto
{
    public SubmissionStatus Status { get; set; }
}
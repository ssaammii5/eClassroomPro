using eClassroomPro.Domain.Common;

namespace eClassroomPro.Domain.Entities;

public class SubmissionActivity : BaseEntity
{
    public int SubmissionId { get; set; }
    public Submission? Submission { get; set; }

    public string Action { get; set; } = string.Empty;
    public int ActorId { get; set; }
    public User? Actor { get; set; }
}
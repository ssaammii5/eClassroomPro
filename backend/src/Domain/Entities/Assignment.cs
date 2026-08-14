using eClassroomPro.Domain.Common;
using eClassroomPro.Domain.Enums;

namespace eClassroomPro.Domain.Entities;

public class Assignment : BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;

    // Phase 8: topic grouping + kind to match the frontend classwork UI.
    public string Topic { get; set; } = string.Empty;
    public AssignmentKind Kind { get; set; } = AssignmentKind.Assignment;

    public int CourseId { get; set; }
    public Course? Course { get; set; }

    public int CreatedById { get; set; }
    public User? CreatedBy { get; set; }

    public DateTime DeadlineUtc { get; set; }
    public int MaxMarks { get; set; }
    public AssignmentStatus Status { get; set; } = AssignmentStatus.Draft;

    public ICollection<Submission> Submissions { get; set; } = new List<Submission>();

    public bool IsPublished => Status == AssignmentStatus.Published;

    public bool IsPastDeadline(DateTime utcNow)
    {
        return utcNow >= DeadlineUtc;
    }
}
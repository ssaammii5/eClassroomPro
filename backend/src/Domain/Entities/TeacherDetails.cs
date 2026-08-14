using eClassroomPro.Domain.Common;

namespace eClassroomPro.Domain.Entities;

public class TeacherDetails : BaseEntity
{
    public int UserId { get; set; }
    public User? User { get; set; }

    public string? TeacherId { get; set; }
    public string? Designation { get; set; }
    public string? Department { get; set; }
}
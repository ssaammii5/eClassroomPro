using eClassroomPro.Domain.Common;

namespace eClassroomPro.Domain.Entities;

public class AcademicSemester : BaseEntity
{
    public string Name { get; set; } = string.Empty;
}
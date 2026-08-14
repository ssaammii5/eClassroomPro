using eClassroomPro.Domain.Common;

namespace eClassroomPro.Domain.Entities;

public class AcademicDepartment : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
}
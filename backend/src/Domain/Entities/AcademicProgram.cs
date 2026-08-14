using eClassroomPro.Domain.Common;

namespace eClassroomPro.Domain.Entities;

public class AcademicProgram : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
}
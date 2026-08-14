using eClassroomPro.Domain.Common;

namespace eClassroomPro.Domain.Entities;

public class AppSetting : BaseEntity
{
    public string Key { get; set; } = string.Empty;
    public string Value { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;
    public string Category { get; set; } = "General";
}
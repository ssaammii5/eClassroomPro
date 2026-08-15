using System.ComponentModel.DataAnnotations;

namespace eClassroomPro.Application.DTOs.AppSettings;

public class UpsertAppSettingDto
{
    [Required]
    [MaxLength(200)]
    public string Key { get; set; } = string.Empty;

    [MaxLength(2000)]
    public string Value { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? Description { get; set; }

    [MaxLength(100)]
    public string? Category { get; set; }
}
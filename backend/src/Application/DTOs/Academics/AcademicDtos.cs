using System.ComponentModel.DataAnnotations;

namespace eClassroomPro.Application.DTOs.Academics;

public class AcademicProgramDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
}

public class UpsertAcademicProgramDto
{
    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(1000)]
    public string Description { get; set; } = string.Empty;
}

public class AcademicDepartmentDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
}

public class UpsertAcademicDepartmentDto
{
    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [MaxLength(50)]
    public string Code { get; set; } = string.Empty;
}

public class AcademicSemesterDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
}

public class UpsertAcademicSemesterDto
{
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;
}
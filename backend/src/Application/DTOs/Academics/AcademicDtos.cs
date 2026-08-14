namespace eClassroomPro.Application.DTOs.Academics;

public class AcademicProgramDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
}

public class UpsertAcademicProgramDto
{
    public string Name { get; set; } = string.Empty;
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
    public string Name { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
}

public class AcademicSemesterDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
}

public class UpsertAcademicSemesterDto
{
    public string Name { get; set; } = string.Empty;
}
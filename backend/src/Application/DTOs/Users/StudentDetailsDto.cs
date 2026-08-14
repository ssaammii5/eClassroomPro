namespace eClassroomPro.Application.DTOs.Users;

public class StudentDetailsDto
{
    public string? FathersName { get; set; }
    public string? MothersName { get; set; }
    public string? DateOfBirth { get; set; }
    public string? Mobile { get; set; }
    public string? Nationality { get; set; }
    public string? StudentId { get; set; }
    public string? RegNo { get; set; }
    public string? Department { get; set; }
    public string? CurrentProgram { get; set; }
    public string? Session { get; set; }
    public string? SemesterSession { get; set; }
    public StudentAddressDto? Address { get; set; }
}

public class StudentAddressDto
{
    public string? Street { get; set; }
    public string? City { get; set; }
    public string? State { get; set; }
    public string? Zip { get; set; }
    public string? Country { get; set; }
}
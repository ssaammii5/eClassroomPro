namespace eClassroomPro.Application.DTOs.Dashboard;

public class DashboardStatsDto
{
    public int TotalUsers { get; set; }
    public int ActiveUsers { get; set; }
    public int TotalTeachers { get; set; }
    public int TotalStudents { get; set; }
    public int TotalCourses { get; set; }
    public int ActiveCourses { get; set; }
    public int TotalAssignments { get; set; }
    public int PublishedAssignments { get; set; }
    public int TotalSubmissions { get; set; }
    public int GradedSubmissions { get; set; }
    public int PendingSubmissions { get; set; }
}
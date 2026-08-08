namespace eClassroomPro.Application.Interfaces;

public interface IDateTimeProvider
{
    DateTime UtcNow { get; }
}
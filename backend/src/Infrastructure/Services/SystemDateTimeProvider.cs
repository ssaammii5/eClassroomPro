using eClassroomPro.Application.Interfaces;

namespace eClassroomPro.Infrastructure.Services;

public class SystemDateTimeProvider : IDateTimeProvider
{
    public DateTime UtcNow => DateTime.UtcNow;
}
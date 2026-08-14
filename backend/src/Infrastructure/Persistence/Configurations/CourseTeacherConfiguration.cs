using eClassroomPro.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace eClassroomPro.Infrastructure.Persistence.Configurations;

public class CourseTeacherConfiguration : IEntityTypeConfiguration<CourseTeacher>
{
    public void Configure(EntityTypeBuilder<CourseTeacher> builder)
    {
        builder.HasKey(x => x.Id);

        builder.HasIndex(x => new { x.CourseId, x.TeacherId })
            .IsUnique();

        builder.HasOne(x => x.Course)
            .WithMany(x => x.CourseTeachers)
            .HasForeignKey(x => x.CourseId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(x => x.Teacher)
            .WithMany()
            .HasForeignKey(x => x.TeacherId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
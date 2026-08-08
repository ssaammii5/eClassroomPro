using eClassroomPro.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace eClassroomPro.Infrastructure.Persistence.Configurations;

public class CourseConfiguration : IEntityTypeConfiguration<Course>
{
    public void Configure(EntityTypeBuilder<Course> builder)
    {
        builder.HasKey(x => x.Id);

        builder.Property(x => x.Name)
            .HasMaxLength(200)
            .IsRequired();

        builder.Property(x => x.Subject)
            .HasMaxLength(200)
            .IsRequired();

        builder.HasOne(x => x.Teacher)
            .WithMany(x => x.TaughtCourses)
            .HasForeignKey(x => x.TeacherId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}
using eClassroomPro.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace eClassroomPro.Infrastructure.Persistence.Configurations;

public class AssignmentConfiguration : IEntityTypeConfiguration<Assignment>
{
    public void Configure(EntityTypeBuilder<Assignment> builder)
    {
        builder.HasKey(x => x.Id);

        builder.Property(x => x.Title)
            .HasMaxLength(300)
            .IsRequired();

        builder.Property(x => x.Description)
            .HasMaxLength(4000)
            .IsRequired();

        builder.Property(x => x.Topic)
            .HasMaxLength(300)
            .IsRequired();

        builder.Property(x => x.Kind)
            .HasConversion<int>();

        builder.Property(x => x.Status)
            .HasConversion<int>();

        builder.HasOne(x => x.Course)
            .WithMany(x => x.Assignments)
            .HasForeignKey(x => x.CourseId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(x => x.CreatedBy)
            .WithMany(x => x.CreatedAssignments)
            .HasForeignKey(x => x.CreatedById)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
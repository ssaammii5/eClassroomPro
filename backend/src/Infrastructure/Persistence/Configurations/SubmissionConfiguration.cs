using eClassroomPro.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace eClassroomPro.Infrastructure.Persistence.Configurations;

public class SubmissionConfiguration : IEntityTypeConfiguration<Submission>
{
    public void Configure(EntityTypeBuilder<Submission> builder)
    {
        builder.HasKey(x => x.Id);

        builder.HasIndex(x => new { x.AssignmentId, x.StudentId })
            .IsUnique();

        builder.Property(x => x.Answer)
            .IsRequired();

        builder.Property(x => x.Marks)
            .HasPrecision(6, 2);

        builder.Property(x => x.Status)
            .HasConversion<int>();

        builder.HasOne(x => x.Assignment)
            .WithMany(x => x.Submissions)
            .HasForeignKey(x => x.AssignmentId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(x => x.Student)
            .WithMany(x => x.Submissions)
            .HasForeignKey(x => x.StudentId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
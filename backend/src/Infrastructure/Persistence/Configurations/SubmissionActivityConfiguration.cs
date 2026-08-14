using eClassroomPro.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace eClassroomPro.Infrastructure.Persistence.Configurations;

public class SubmissionActivityConfiguration : IEntityTypeConfiguration<SubmissionActivity>
{
    public void Configure(EntityTypeBuilder<SubmissionActivity> builder)
    {
        builder.HasKey(x => x.Id);

        builder.Property(x => x.Action).HasMaxLength(500).IsRequired();

        builder.HasOne(x => x.Submission)
            .WithMany(x => x.Activities)
            .HasForeignKey(x => x.SubmissionId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(x => x.Actor)
            .WithMany()
            .HasForeignKey(x => x.ActorId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
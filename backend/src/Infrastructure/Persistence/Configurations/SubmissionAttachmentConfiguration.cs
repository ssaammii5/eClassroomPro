using eClassroomPro.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace eClassroomPro.Infrastructure.Persistence.Configurations;

public class SubmissionAttachmentConfiguration : IEntityTypeConfiguration<SubmissionAttachment>
{
    public void Configure(EntityTypeBuilder<SubmissionAttachment> builder)
    {
        builder.HasKey(x => x.Id);

        builder.Property(x => x.FileName).HasMaxLength(300).IsRequired();
        builder.Property(x => x.FileType).HasMaxLength(50);
        builder.Property(x => x.StoredPath).HasMaxLength(1000);
        builder.Property(x => x.Kind).HasMaxLength(20);
        builder.Property(x => x.Url).HasMaxLength(1000);

        builder.HasOne(x => x.Submission)
            .WithMany(x => x.Attachments)
            .HasForeignKey(x => x.SubmissionId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
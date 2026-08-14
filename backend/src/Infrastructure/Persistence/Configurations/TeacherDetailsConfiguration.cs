using eClassroomPro.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace eClassroomPro.Infrastructure.Persistence.Configurations;

public class TeacherDetailsConfiguration : IEntityTypeConfiguration<TeacherDetails>
{
    public void Configure(EntityTypeBuilder<TeacherDetails> builder)
    {
        builder.HasKey(x => x.Id);

        builder.HasIndex(x => x.UserId).IsUnique();

        builder.Property(x => x.TeacherId).HasMaxLength(100);
        builder.Property(x => x.Designation).HasMaxLength(100);
        builder.Property(x => x.Department).HasMaxLength(200);

        builder.HasOne(x => x.User)
            .WithOne(x => x.TeacherDetails)
            .HasForeignKey<TeacherDetails>(x => x.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
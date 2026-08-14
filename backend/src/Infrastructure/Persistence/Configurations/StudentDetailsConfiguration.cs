using eClassroomPro.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace eClassroomPro.Infrastructure.Persistence.Configurations;

public class StudentDetailsConfiguration : IEntityTypeConfiguration<StudentDetails>
{
    public void Configure(EntityTypeBuilder<StudentDetails> builder)
    {
        builder.HasKey(x => x.Id);

        builder.HasIndex(x => x.UserId).IsUnique();

        builder.Property(x => x.StudentId).HasMaxLength(100);
        builder.Property(x => x.RegNo).HasMaxLength(100);
        builder.Property(x => x.Department).HasMaxLength(200);
        builder.Property(x => x.CurrentProgram).HasMaxLength(100);
        builder.Property(x => x.Session).HasMaxLength(100);
        builder.Property(x => x.SemesterSession).HasMaxLength(100);
        builder.Property(x => x.FathersName).HasMaxLength(200);
        builder.Property(x => x.MothersName).HasMaxLength(200);
        builder.Property(x => x.DateOfBirth).HasMaxLength(50);
        builder.Property(x => x.Mobile).HasMaxLength(50);
        builder.Property(x => x.Nationality).HasMaxLength(100);
        builder.Property(x => x.Street).HasMaxLength(300);
        builder.Property(x => x.City).HasMaxLength(100);
        builder.Property(x => x.State).HasMaxLength(100);
        builder.Property(x => x.Zip).HasMaxLength(20);
        builder.Property(x => x.Country).HasMaxLength(100);

        builder.HasOne(x => x.User)
            .WithOne(x => x.StudentDetails)
            .HasForeignKey<StudentDetails>(x => x.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
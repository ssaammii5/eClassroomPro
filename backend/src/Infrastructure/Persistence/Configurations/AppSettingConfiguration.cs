using eClassroomPro.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace eClassroomPro.Infrastructure.Persistence.Configurations;

public class AppSettingConfiguration : IEntityTypeConfiguration<AppSetting>
{
    public void Configure(EntityTypeBuilder<AppSetting> builder)
    {
        builder.HasKey(x => x.Id);

        builder.Property(x => x.Key)
            .HasMaxLength(200)
            .IsRequired();

        builder.HasIndex(x => x.Key)
            .IsUnique();

        builder.Property(x => x.Value)
            .HasMaxLength(2000)
            .IsRequired();

        builder.Property(x => x.Description)
            .HasMaxLength(500)
            .IsRequired();

        builder.Property(x => x.Category)
            .HasMaxLength(100)
            .IsRequired();
    }
}
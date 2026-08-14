using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace eClassroomPro.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class Phase7AppSettingMetadata : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "AppSettings",
                type: "character varying(500)",
                maxLength: 500,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Category",
                table: "AppSettings",
                type: "character varying(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "General");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Description",
                table: "AppSettings");

            migrationBuilder.DropColumn(
                name: "Category",
                table: "AppSettings");
        }
    }
}
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace eClassroomPro.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class Phase8AssignmentTopicKind : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Topic",
                table: "Assignments",
                type: "character varying(300)",
                maxLength: 300,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "Kind",
                table: "Assignments",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(name: "Topic", table: "Assignments");
            migrationBuilder.DropColumn(name: "Kind", table: "Assignments");
        }
    }
}
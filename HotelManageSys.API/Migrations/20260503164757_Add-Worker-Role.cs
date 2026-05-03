using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HotelManageSys.API.Migrations
{
    /// <inheritdoc />
    public partial class AddWorkerRole : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Role",
                table: "Workers",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.UpdateData(
                table: "Workers",
                keyColumn: "WorkerId",
                keyValue: 1,
                column: "Role",
                value: "ADMIN");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Role",
                table: "Workers");
        }
    }
}

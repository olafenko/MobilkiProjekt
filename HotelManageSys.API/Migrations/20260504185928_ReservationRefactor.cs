using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HotelManageSys.API.Migrations
{
    /// <inheritdoc />
    public partial class ReservationRefactor : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "PurchasePrice",
                table: "ReservationAdditionalOffers",
                newName: "OfferPrice");

            migrationBuilder.AddColumn<string>(
                name: "Notes",
                table: "Reservations",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Notes",
                table: "Reservations");

            migrationBuilder.RenameColumn(
                name: "OfferPrice",
                table: "ReservationAdditionalOffers",
                newName: "PurchasePrice");
        }
    }
}

using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace HotelManageSys.API.Migrations
{
    /// <inheritdoc />
    public partial class InitMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AdditionalOffers",
                columns: table => new
                {
                    AdditionalOfferId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(80)", maxLength: 80, nullable: false),
                    Price = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AdditionalOffers", x => x.AdditionalOfferId);
                });

            migrationBuilder.CreateTable(
                name: "Amenities",
                columns: table => new
                {
                    AmenityId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(80)", maxLength: 80, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Amenities", x => x.AmenityId);
                });

            migrationBuilder.CreateTable(
                name: "Guests",
                columns: table => new
                {
                    GuestId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FirstName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    LastName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    PhoneNumber = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IdentityCardNumber = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Guests", x => x.GuestId);
                });

            migrationBuilder.CreateTable(
                name: "RoomTypes",
                columns: table => new
                {
                    RoomTypeId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(80)", maxLength: 80, nullable: false),
                    BasePrice = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RoomTypes", x => x.RoomTypeId);
                });

            migrationBuilder.CreateTable(
                name: "Workers",
                columns: table => new
                {
                    WorkerId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FirstName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    LastName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Login = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Password = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Role = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Workers", x => x.WorkerId);
                });

            migrationBuilder.CreateTable(
                name: "Rooms",
                columns: table => new
                {
                    RoomId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Number = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    Floor = table.Column<int>(type: "int", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    RoomTypeId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Rooms", x => x.RoomId);
                    table.ForeignKey(
                        name: "FK_Rooms_RoomTypes_RoomTypeId",
                        column: x => x.RoomTypeId,
                        principalTable: "RoomTypes",
                        principalColumn: "RoomTypeId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "AmenityRoom",
                columns: table => new
                {
                    AmenitiesAmenityId = table.Column<int>(type: "int", nullable: false),
                    RoomsRoomId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AmenityRoom", x => new { x.AmenitiesAmenityId, x.RoomsRoomId });
                    table.ForeignKey(
                        name: "FK_AmenityRoom_Amenities_AmenitiesAmenityId",
                        column: x => x.AmenitiesAmenityId,
                        principalTable: "Amenities",
                        principalColumn: "AmenityId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AmenityRoom_Rooms_RoomsRoomId",
                        column: x => x.RoomsRoomId,
                        principalTable: "Rooms",
                        principalColumn: "RoomId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Reservations",
                columns: table => new
                {
                    ReservationId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TotalPrice = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    ReservationDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CheckInDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CheckOutDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Notes = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    ReservationStatus = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    GuestId = table.Column<int>(type: "int", nullable: false),
                    RoomId = table.Column<int>(type: "int", nullable: false),
                    WorkerId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Reservations", x => x.ReservationId);
                    table.ForeignKey(
                        name: "FK_Reservations_Guests_GuestId",
                        column: x => x.GuestId,
                        principalTable: "Guests",
                        principalColumn: "GuestId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Reservations_Rooms_RoomId",
                        column: x => x.RoomId,
                        principalTable: "Rooms",
                        principalColumn: "RoomId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Reservations_Workers_WorkerId",
                        column: x => x.WorkerId,
                        principalTable: "Workers",
                        principalColumn: "WorkerId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Payments",
                columns: table => new
                {
                    PaymentId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Title = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    PaymentStatus = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PaymentMethod = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Price = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    PaymentDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    ReservationId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Payments", x => x.PaymentId);
                    table.ForeignKey(
                        name: "FK_Payments_Reservations_ReservationId",
                        column: x => x.ReservationId,
                        principalTable: "Reservations",
                        principalColumn: "ReservationId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ReservationAdditionalOffers",
                columns: table => new
                {
                    ReservationAdditionalOfferId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ReservationId = table.Column<int>(type: "int", nullable: false),
                    AdditionalOfferId = table.Column<int>(type: "int", nullable: false),
                    OfferPrice = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Quantity = table.Column<int>(type: "int", nullable: false),
                    Notes = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ReservationAdditionalOffers", x => x.ReservationAdditionalOfferId);
                    table.ForeignKey(
                        name: "FK_ReservationAdditionalOffers_AdditionalOffers_AdditionalOfferId",
                        column: x => x.AdditionalOfferId,
                        principalTable: "AdditionalOffers",
                        principalColumn: "AdditionalOfferId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ReservationAdditionalOffers_Reservations_ReservationId",
                        column: x => x.ReservationId,
                        principalTable: "Reservations",
                        principalColumn: "ReservationId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "AdditionalOffers",
                columns: new[] { "AdditionalOfferId", "IsActive", "Name", "Price" },
                values: new object[,]
                {
                    { 1, true, "Śniadanie (Bufet)", 45m },
                    { 2, true, "Miejsce parkingowe", 30m },
                    { 3, true, "Szampan", 150m },
                    { 4, true, "Przedłużone wymeldowanie", 100m }
                });

            migrationBuilder.InsertData(
                table: "Amenities",
                columns: new[] { "AmenityId", "Description", "IsActive", "Name" },
                values: new object[,]
                {
                    { 1, "Darmowy szybki internet", true, "WiFi" },
                    { 2, "Klimatyzacja sterowana z pokoju", true, "Klimatyzacja" },
                    { 3, "Kibel", true, "Kibel" },
                    { 4, "Schłodzone napoje", true, "Minibar" }
                });

            migrationBuilder.InsertData(
                table: "Guests",
                columns: new[] { "GuestId", "Email", "FirstName", "IdentityCardNumber", "IsActive", "LastName", "PhoneNumber" },
                values: new object[,]
                {
                    { 1, "pudzian@test.pl", "Mariusz", "ID123", true, "Pudzianowski", "123567345" },
                    { 2, "robert@lewy.pl", "Robert", "PASS987", true, "Lewandowski", "987654321" },
                    { 3, "iga@tennis.pl", "Iga", "ID456", true, "Świątek", "555666777" }
                });

            migrationBuilder.InsertData(
                table: "RoomTypes",
                columns: new[] { "RoomTypeId", "BasePrice", "Description", "IsActive", "Name" },
                values: new object[,]
                {
                    { 1, 180m, "Wygodny pokój standardowy 1-2 os.", true, "Standard" },
                    { 2, 350m, "Pokój o podwyższonym standardzie z widokiem", true, "Deluxe" },
                    { 3, 700m, "Przestronny apartament z aneksem kuchennym", true, "Apartament VIP" },
                    { 4, 450m, "Idealny pokój dla rodziny 2+2", true, "Rodzinny" }
                });

            migrationBuilder.InsertData(
                table: "Workers",
                columns: new[] { "WorkerId", "FirstName", "IsActive", "LastName", "Login", "Password", "Role" },
                values: new object[,]
                {
                    { 1, "Adam", true, "Kowalski", "admin", "admin123", "ADMIN" },
                    { 2, "Anna", true, "Nowak", "anowak", "user123", "WORKER" }
                });

            migrationBuilder.InsertData(
                table: "Rooms",
                columns: new[] { "RoomId", "Description", "Floor", "IsActive", "Number", "RoomTypeId", "Status" },
                values: new object[,]
                {
                    { 1, null, 1, true, "101", 1, "AVAILABLE" },
                    { 2, null, 1, true, "102", 1, "OCCUPIED" },
                    { 3, null, 1, true, "103", 4, "OCCUPIED" },
                    { 4, null, 2, true, "201", 2, "AVAILABLE" },
                    { 5, null, 2, true, "202", 2, "AVAILABLE" },
                    { 6, null, 3, true, "301", 3, "AVAILABLE" }
                });

            migrationBuilder.InsertData(
                table: "Reservations",
                columns: new[] { "ReservationId", "CheckInDate", "CheckOutDate", "GuestId", "IsActive", "Notes", "ReservationDate", "ReservationStatus", "RoomId", "TotalPrice", "WorkerId" },
                values: new object[,]
                {
                    { 1, new DateTime(2024, 1, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), new DateTime(2024, 1, 12, 0, 0, 0, 0, DateTimeKind.Unspecified), 1, true, "Jakieś tam uwagi", new DateTime(2024, 1, 5, 0, 0, 0, 0, DateTimeKind.Unspecified), "COMPLETED", 4, 820m, 1 },
                    { 2, new DateTime(2024, 3, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), new DateTime(2024, 3, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), 2, true, "Testowa notatka", new DateTime(2024, 3, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "CONFIRMED", 2, 945m, 2 },
                    { 3, new DateTime(2024, 5, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new DateTime(2024, 5, 5, 0, 0, 0, 0, DateTimeKind.Unspecified), 3, true, "VIP", new DateTime(2024, 4, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "PENDING", 6, 2800m, 2 }
                });

            migrationBuilder.InsertData(
                table: "Payments",
                columns: new[] { "PaymentId", "IsActive", "PaymentDate", "PaymentMethod", "PaymentStatus", "Price", "ReservationId", "Title" },
                values: new object[,]
                {
                    { 1, true, new DateTime(2024, 1, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), "CARD", "PAID", 820m, 1, "Opłata za pobyt (ID: 1)" },
                    { 2, true, new DateTime(2024, 3, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "MONEY", "PAID", 200m, 2, "Zaliczka rezerwacyjna" },
                    { 3, true, new DateTime(2024, 4, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "TRANSFER", "PENDING", 2800m, 3, "Pełna opłata" }
                });

            migrationBuilder.InsertData(
                table: "ReservationAdditionalOffers",
                columns: new[] { "ReservationAdditionalOfferId", "AdditionalOfferId", "IsActive", "Notes", "OfferPrice", "Quantity", "ReservationId" },
                values: new object[,]
                {
                    { 1, 1, true, "", 45m, 2, 1 },
                    { 2, 2, true, "Nr rej. WA12345", 30m, 1, 1 },
                    { 3, 1, true, "", 45m, 1, 2 }
                });

            migrationBuilder.CreateIndex(
                name: "IX_AmenityRoom_RoomsRoomId",
                table: "AmenityRoom",
                column: "RoomsRoomId");

            migrationBuilder.CreateIndex(
                name: "IX_Payments_ReservationId",
                table: "Payments",
                column: "ReservationId");

            migrationBuilder.CreateIndex(
                name: "IX_ReservationAdditionalOffers_AdditionalOfferId",
                table: "ReservationAdditionalOffers",
                column: "AdditionalOfferId");

            migrationBuilder.CreateIndex(
                name: "IX_ReservationAdditionalOffers_ReservationId",
                table: "ReservationAdditionalOffers",
                column: "ReservationId");

            migrationBuilder.CreateIndex(
                name: "IX_Reservations_GuestId",
                table: "Reservations",
                column: "GuestId");

            migrationBuilder.CreateIndex(
                name: "IX_Reservations_RoomId",
                table: "Reservations",
                column: "RoomId");

            migrationBuilder.CreateIndex(
                name: "IX_Reservations_WorkerId",
                table: "Reservations",
                column: "WorkerId");

            migrationBuilder.CreateIndex(
                name: "IX_Rooms_RoomTypeId",
                table: "Rooms",
                column: "RoomTypeId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AmenityRoom");

            migrationBuilder.DropTable(
                name: "Payments");

            migrationBuilder.DropTable(
                name: "ReservationAdditionalOffers");

            migrationBuilder.DropTable(
                name: "Amenities");

            migrationBuilder.DropTable(
                name: "AdditionalOffers");

            migrationBuilder.DropTable(
                name: "Reservations");

            migrationBuilder.DropTable(
                name: "Guests");

            migrationBuilder.DropTable(
                name: "Rooms");

            migrationBuilder.DropTable(
                name: "Workers");

            migrationBuilder.DropTable(
                name: "RoomTypes");
        }
    }
}

using HotelManageSys.API.Models.Enums;

namespace HotelManageSys.API.Features.Rooms.Messages.Queries
{
    public class RoomDTO
    {

        public int RoomId { get; set; }
        public required string Number { get; set; }
        public int Floor { get; set; }
        public string? Description { get; set; }
        public string? Status { get; set; }
        public int RoomTypeId { get; set; }
        public string? RoomTypeName { get; set; }

        public decimal BasePrice { get; set; }

        public List<string> AmenitiesNames { get; set; }

        public bool IsActive { get; set; }

    }
}

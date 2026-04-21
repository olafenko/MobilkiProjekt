namespace HotelManageSys.API.Features.RoomTypes.DTO_s
{
    public class RoomTypeDTO
    {
        public int RoomTypeId { get; set; }

        public required string Name { get; set; }

        public decimal BasePrice{ get; set; }
        public string? Description { get; set; }

        public bool IsActive { get; set; } = true;


    }
}

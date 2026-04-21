namespace HotelManageSys.API.Features.Amenities.DTO_s
{
    public class AmenityDTO
    {
        public int AmenityId { get; set; }
        public required string Name { get; set; }
        public string? Description { get; set; }
        public bool IsActive { get; set; } = true;
    }
}

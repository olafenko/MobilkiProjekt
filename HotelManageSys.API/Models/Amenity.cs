namespace HotelManageSys.API.Models
{
    public class Amenity
    {

        public int AmenityId { get; set; }

        public required string Name { get; set; }

        public string? Description{ get; set; }

        public bool IsActive { get; set; }

        public virtual ICollection<Room> Rooms { get; set; } = new List<Room>();

    }
}
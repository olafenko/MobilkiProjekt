using HotelManageSys.API.Models.Enums;

namespace HotelManageSys.API.Models
{
    public class Room
    {

        public int RoomId { get; set; }
        public required string Number { get; set; }
        public int Floor { get; set; }
        public string? Description { get; set; }
        public RoomStatus Status { get; set; }
        public bool IsActive { get; set; }

        public int RoomTypeId { get; set; }

        public virtual RoomType RoomType { get; set; } = null!;

        public virtual ICollection<Reservation>  Reservations { get; set; } = new List<Reservation>();
        public virtual ICollection<Amenity> Amenities { get; set; } = new List<Amenity>();


    }
}

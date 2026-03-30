namespace HotelManageSys.API.Models
{
    public class RoomType
    {

        public int RoomTypeId { get; set; }

        public required string Name { get; set; }

        public decimal BasePrice { get; set; }

        public string? Description { get; set; }

        public bool IsActive { get; set; }


        public virtual ICollection<Room> Rooms { get; set; } = new List<Room>();

    }
}
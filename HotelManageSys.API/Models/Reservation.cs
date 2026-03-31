using HotelManageSys.API.Models.Enums;

namespace HotelManageSys.API.Models
{
    public class Reservation
    {

        public int ReservationId { get; set; }
        public decimal TotalPrice { get; set; }

        public DateTime ReservationDate { get; set; }

        public DateTime CheckInDate { get; set; }
        public DateTime CheckOutDate { get; set; }

        public bool IsActive { get; set; }
        public ReservationStatus ReservationStatus { get; set; }

        public int GuestId { get; set; }
        public virtual Guest Guest { get; set; } = null!;

        public int RoomId { get; set; }
        public virtual Room Room { get; set; } = null!;

        public int WorkerId { get; set; }

        public virtual Worker Worker { get; set; } = null!;

        public virtual ICollection<HotelService> HotelServices { get; set; } = new List<HotelService>();


    }
}
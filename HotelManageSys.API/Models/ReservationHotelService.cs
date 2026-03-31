namespace HotelManageSys.API.Models
{
    public class ReservationHotelService
    {

        public int ReservationHotelServiceId { get; set; }
        public int ReservationId { get; set; }
        public int HotelServiceId { get; set; }

        public int Quantity { get; set; }
        public string? Notes { get; set; }

        public bool IsActive { get; set; }

        public virtual Reservation Reservation { get; set; } = null!;
        public virtual HotelService HotelService { get; set; } = null!;

    }
}

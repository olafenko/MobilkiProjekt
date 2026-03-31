using HotelManageSys.API.Models.Enums;

namespace HotelManageSys.API.Models
{
    public class Payment
    {

        public int PaymentId { get; set; }
        public required string Title { get; set; }
        public PaymentStatus PaymentStatus { get; set; }
        public PaymentMethod PaymentMethod { get; set; }

        public decimal Price { get; set; }

        public DateTime PaymentDate { get; set; }
        public bool IsActive { get; set; }

        public int ReservationId { get; set; }
        public virtual Reservation Reservation { get; set; } = null!;

    }
}

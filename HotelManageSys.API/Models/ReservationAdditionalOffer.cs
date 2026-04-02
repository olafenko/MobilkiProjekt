namespace HotelManageSys.API.Models
{
    public class ReservationAdditionalOffer
    {

        public int ReservationAdditionalOfferId { get; set; }
        public int ReservationId { get; set; }
        public int AdditionalOfferId { get; set; }

        public int Quantity { get; set; }
        public string? Notes { get; set; }

        public bool IsActive { get; set; } = true;

        public virtual Reservation Reservation { get; set; } = null!;
        public virtual AdditionalOffer AdditionalOffer { get; set; } = null!;

    }
}

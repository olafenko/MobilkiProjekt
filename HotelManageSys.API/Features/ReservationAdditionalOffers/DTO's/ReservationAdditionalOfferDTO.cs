namespace HotelManageSys.API.Features.ReservationAdditionalOffers
{
    public class ReservationAdditionalOfferDTO
    {

        public int ReservationAdditionalOfferId { get; set; }
        public int ReservationId { get; set; }
        public int AdditionalOfferId{ get; set; }
        public int AdditionalOfferName { get; set; }
        public string? Notes { get; set; }
        public int Quantity { get; set; }
        public decimal OfferPrice{ get; set; }
        public bool IsActive { get; set; }


    }
}

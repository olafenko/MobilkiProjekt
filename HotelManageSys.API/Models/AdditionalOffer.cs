namespace HotelManageSys.API.Models
{
    public class AdditionalOffer
    {


        public int AdditionalOfferId { get; set; }
        public required string Name { get; set; }
        public decimal Price { get; set; }
        public bool IsActive { get; set; } = true;

        public virtual ICollection<ReservationAdditionalOffer> ReservationAdditionalOffers { get; set; } = new List<ReservationAdditionalOffer>();

    }
}
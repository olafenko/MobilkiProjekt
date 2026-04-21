namespace HotelManageSys.API.Features.AdditionalOffers.DTO_s
{
    public class AdditionalOfferDTO
    {
        public int AdditionalOfferId { get; set; }
        public required string Name { get; set; }
        public decimal Price { get; set; }
        public bool IsActive { get; set; } = true;
    }
}


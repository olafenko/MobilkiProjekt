using MediatR;

namespace HotelManageSys.API.Features.AdditionalOffers.Messages.Commands
{
    public class UpdateAdditionalOfferCommand : IRequest<Unit>
    {
        public int AdditionalOfferId { get; set; }
        public required string Name { get; set; }
        public decimal Price { get; set; }
        public bool IsActive { get; set; } = true;
    }
}


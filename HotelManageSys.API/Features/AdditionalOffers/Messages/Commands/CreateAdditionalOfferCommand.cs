using MediatR;

namespace HotelManageSys.API.Features.AdditionalOffers.Messages.Commands
{
    public class CreateAdditionalOfferCommand : IRequest<int>
    {
        public required string Name { get; set; }
        public decimal Price { get; set; }
    }
}


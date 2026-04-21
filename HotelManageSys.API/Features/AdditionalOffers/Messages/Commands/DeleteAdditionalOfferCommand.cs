using MediatR;

namespace HotelManageSys.API.Features.AdditionalOffers.Messages.Commands
{
    public class DeleteAdditionalOfferCommand : IRequest<Unit>
    {
        public int Id { get; set; }

        public DeleteAdditionalOfferCommand(int id)
        {
            Id = id;
        }
    }
}


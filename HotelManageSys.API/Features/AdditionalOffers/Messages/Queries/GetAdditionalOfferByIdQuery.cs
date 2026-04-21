using HotelManageSys.API.Features.AdditionalOffers.DTO_s;
using MediatR;

namespace HotelManageSys.API.Features.AdditionalOffers.Messages.Queries
{
    public class GetAdditionalOfferByIdQuery : IRequest<AdditionalOfferDTO>
    {
        public int Id { get; set; }

        public GetAdditionalOfferByIdQuery(int id)
        {
            Id = id;
        }
    }
}


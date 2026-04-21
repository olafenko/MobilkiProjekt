using HotelManageSys.API.Features.AdditionalOffers.DTO_s;
using MediatR;

namespace HotelManageSys.API.Features.AdditionalOffers.Messages.Queries
{
    public class GetAllAdditionalOffersQuery : IRequest<IEnumerable<AdditionalOfferDTO>>
    {
    }
}


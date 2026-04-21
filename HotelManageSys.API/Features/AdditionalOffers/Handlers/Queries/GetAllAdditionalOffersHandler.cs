using HotelManageSys.API.Features.AdditionalOffers.DTO_s;
using HotelManageSys.API.Features.AdditionalOffers.Messages.Queries;
using HotelManageSys.API.Features.AdditionalOffers.Providers;
using Mapster;
using MediatR;

namespace HotelManageSys.API.Features.AdditionalOffers.Handlers.Queries
{
    public class GetAllAdditionalOffersHandler : IRequestHandler<GetAllAdditionalOffersQuery, IEnumerable<AdditionalOfferDTO>>
    {
        private readonly IAdditionalOfferProvider _additionalOfferProvider;

        public GetAllAdditionalOffersHandler(IAdditionalOfferProvider additionalOfferProvider)
        {
            _additionalOfferProvider = additionalOfferProvider;
        }

        public async Task<IEnumerable<AdditionalOfferDTO>> Handle(GetAllAdditionalOffersQuery request, CancellationToken cancellationToken)
        {
            return (await _additionalOfferProvider.GetAllAdditionalOffersAsync(cancellationToken)).Adapt<IEnumerable<AdditionalOfferDTO>>();
        }
    }
}


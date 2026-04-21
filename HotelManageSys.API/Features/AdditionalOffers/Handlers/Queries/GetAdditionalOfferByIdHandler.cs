using HotelManageSys.API.Features.AdditionalOffers.DTO_s;
using HotelManageSys.API.Features.AdditionalOffers.Messages.Queries;
using HotelManageSys.API.Features.AdditionalOffers.Providers;
using Mapster;
using MediatR;

namespace HotelManageSys.API.Features.AdditionalOffers.Handlers.Queries
{
    public class GetAdditionalOfferByIdHandler : IRequestHandler<GetAdditionalOfferByIdQuery, AdditionalOfferDTO?>
    {
        private readonly IAdditionalOfferProvider _additionalOfferProvider;

        public GetAdditionalOfferByIdHandler(IAdditionalOfferProvider additionalOfferProvider)
        {
            _additionalOfferProvider = additionalOfferProvider;
        }

        public async Task<AdditionalOfferDTO?> Handle(GetAdditionalOfferByIdQuery request, CancellationToken cancellationToken)
        {
            return (await _additionalOfferProvider.GetAdditionalOfferByIdAsync(request.Id, true, cancellationToken))?.Adapt<AdditionalOfferDTO>();
        }
    }
}


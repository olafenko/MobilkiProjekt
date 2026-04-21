using HotelManageSys.API.Features.AdditionalOffers.Messages.Commands;
using HotelManageSys.API.Features.AdditionalOffers.Providers;
using HotelManageSys.API.Features.AdditionalOffers.Services;
using Mapster;
using MediatR;

namespace HotelManageSys.API.Features.AdditionalOffers.Handlers.Commands
{
    public class UpdateAdditionalOfferHandler : IRequestHandler<UpdateAdditionalOfferCommand, Unit>
    {
        private readonly IAdditionalOfferService _additionalOfferService;
        private readonly ILogger<UpdateAdditionalOfferHandler> _logger;
        private readonly IAdditionalOfferProvider _additionalOfferProvider;

        public UpdateAdditionalOfferHandler(
            IAdditionalOfferService additionalOfferService,
            ILogger<UpdateAdditionalOfferHandler> logger,
            IAdditionalOfferProvider additionalOfferProvider)
        {
            _additionalOfferService = additionalOfferService;
            _logger = logger;
            _additionalOfferProvider = additionalOfferProvider;
        }

        public async Task<Unit> Handle(UpdateAdditionalOfferCommand request, CancellationToken cancellationToken)
        {
            var additionalOffer = await _additionalOfferProvider.GetAdditionalOfferByIdAsync(request.AdditionalOfferId, false, cancellationToken);

            _logger.LogInformation("Aktualizowanie oferty dodatkowej ID: {AdditionalOfferId}", request.AdditionalOfferId);

            request.Adapt(additionalOffer);

            await _additionalOfferService.UpdateAdditionalOffer(additionalOffer, cancellationToken);

            _logger.LogInformation("Zaaktualizowano ofertę dodatkową ID: {AdditionalOfferId}", request.AdditionalOfferId);

            return Unit.Value;
        }
    }
}


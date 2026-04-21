using HotelManageSys.API.Features.AdditionalOffers.Messages.Commands;
using HotelManageSys.API.Features.AdditionalOffers.Providers;
using HotelManageSys.API.Features.AdditionalOffers.Services;
using MediatR;

namespace HotelManageSys.API.Features.AdditionalOffers.Handlers.Commands
{
    public class DeleteAdditionalOfferHandler : IRequestHandler<DeleteAdditionalOfferCommand, Unit>
    {
        private readonly IAdditionalOfferService _additionalOfferService;
        private readonly ILogger<DeleteAdditionalOfferHandler> _logger;
        private readonly IAdditionalOfferProvider _additionalOfferProvider;

        public DeleteAdditionalOfferHandler(
            IAdditionalOfferService additionalOfferService,
            ILogger<DeleteAdditionalOfferHandler> logger,
            IAdditionalOfferProvider additionalOfferProvider)
        {
            _additionalOfferService = additionalOfferService;
            _logger = logger;
            _additionalOfferProvider = additionalOfferProvider;
        }

        public async Task<Unit> Handle(DeleteAdditionalOfferCommand request, CancellationToken cancellationToken)
        {
            var additionalOffer = await _additionalOfferProvider.GetAdditionalOfferByIdAsync(request.Id, false, cancellationToken);

            _logger.LogInformation("Usuwanie oferty dodatkowej ID: {AdditionalOfferId}", request.Id);

            await _additionalOfferService.DeleteAdditionalOffer(additionalOffer, cancellationToken);

            _logger.LogInformation("Usunięto ofertę dodatkową ID: {AdditionalOfferId}", request.Id);

            return Unit.Value;
        }
    }
}


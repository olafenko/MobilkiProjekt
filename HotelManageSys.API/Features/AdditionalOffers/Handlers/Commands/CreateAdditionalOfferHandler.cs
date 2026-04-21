using HotelManageSys.API.Features.AdditionalOffers.Messages.Commands;
using HotelManageSys.API.Features.AdditionalOffers.Services;
using HotelManageSys.API.Models;
using Mapster;
using MediatR;

namespace HotelManageSys.API.Features.AdditionalOffers.Handlers.Commands
{
    public class CreateAdditionalOfferHandler : IRequestHandler<CreateAdditionalOfferCommand, int>
    {
        private readonly IAdditionalOfferService _additionalOfferService;
        private readonly ILogger<CreateAdditionalOfferHandler> _logger;

        public CreateAdditionalOfferHandler(IAdditionalOfferService additionalOfferService, ILogger<CreateAdditionalOfferHandler> logger)
        {
            _additionalOfferService = additionalOfferService;
            _logger = logger;
        }

        public async Task<int> Handle(CreateAdditionalOfferCommand request, CancellationToken cancellationToken)
        {
            _logger.LogInformation("Dodawanie nowej oferty dodatkowej: {Name}", request.Name);

            var additionalOffer = request.Adapt<AdditionalOffer>();

            await _additionalOfferService.CreateAdditionalOffer(additionalOffer, cancellationToken);

            _logger.LogInformation("Dodano ofertę dodatkową ID: {AdditionalOfferId}", additionalOffer.AdditionalOfferId);

            return additionalOffer.AdditionalOfferId;
        }
    }
}


using HotelManageSys.API.Features.Amenities.Messages.Commands;
using HotelManageSys.API.Features.Amenities.Providers;
using HotelManageSys.API.Features.Amenities.Services;
using Mapster;
using MediatR;

namespace HotelManageSys.API.Features.Amenities.Handlers.Commands
{
    public class UpdateAmenityHandler : IRequestHandler<UpdateAmenityCommand, Unit>
    {
        private readonly IAmenityService _amenityService;
        private readonly ILogger<UpdateAmenityHandler> _logger;
        private readonly IAmenityProvider _amenityProvider;

        public UpdateAmenityHandler(IAmenityService amenityService, ILogger<UpdateAmenityHandler> logger, IAmenityProvider amenityProvider)
        {
            _amenityService = amenityService;
            _logger = logger;
            _amenityProvider = amenityProvider;
        }

        public async Task<Unit> Handle(UpdateAmenityCommand request, CancellationToken cancellationToken)
        {
            var amenity = await _amenityProvider.GetAmenityByIdAsync(request.AmenityId, false, cancellationToken);

            _logger.LogInformation("Aktualizowanie udogodnienia ID: {AmenityId}", request.AmenityId);

            request.Adapt(amenity);

            await _amenityService.UpdateAmenity(amenity, cancellationToken);

            _logger.LogInformation("Zaaktualizowano udogodnienie ID: {AmenityId}", request.AmenityId);

            return Unit.Value;
        }
    }
}


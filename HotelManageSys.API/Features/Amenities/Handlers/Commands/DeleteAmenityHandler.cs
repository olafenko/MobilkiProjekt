using HotelManageSys.API.Features.Amenities.Messages.Commands;
using HotelManageSys.API.Features.Amenities.Providers;
using HotelManageSys.API.Features.Amenities.Services;
using MediatR;

namespace HotelManageSys.API.Features.Amenities.Handlers.Commands
{
    public class DeleteAmenityHandler : IRequestHandler<DeleteAmenityCommand, Unit>
    {
        private readonly IAmenityService _amenityService;
        private readonly ILogger<DeleteAmenityHandler> _logger;
        private readonly IAmenityProvider _amenityProvider;

        public DeleteAmenityHandler(IAmenityService amenityService, ILogger<DeleteAmenityHandler> logger, IAmenityProvider amenityProvider)
        {
            _amenityService = amenityService;
            _logger = logger;
            _amenityProvider = amenityProvider;
        }

        public async Task<Unit> Handle(DeleteAmenityCommand request, CancellationToken cancellationToken)
        {
            var amenity = await _amenityProvider.GetAmenityByIdAsync(request.Id, false, cancellationToken);

            _logger.LogInformation("Usuwanie udogodnienia ID: {AmenityId}", request.Id);

            await _amenityService.DeleteAmenity(amenity, cancellationToken);

            _logger.LogInformation("Usunięto udogodnienie ID: {AmenityId}", request.Id);

            return Unit.Value;
        }
    }
}


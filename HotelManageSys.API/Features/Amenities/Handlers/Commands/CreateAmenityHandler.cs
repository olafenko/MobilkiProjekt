using HotelManageSys.API.Exceptions;
using HotelManageSys.API.Features.Amenities.Messages.Commands;
using HotelManageSys.API.Features.Amenities.Providers;
using HotelManageSys.API.Features.Amenities.Services;
using HotelManageSys.API.Models;
using Mapster;
using MediatR;

namespace HotelManageSys.API.Features.Amenities.Handlers.Commands
{
    public class CreateAmenityHandler : IRequestHandler<CreateAmenityCommand, int>
    {
        private readonly IAmenityService _amenityService;
        private readonly IAmenityProvider _amenityProvider;
        private readonly ILogger<CreateAmenityHandler> _logger;


        public CreateAmenityHandler(IAmenityService amenityService, IAmenityProvider amenityProvider, ILogger<CreateAmenityHandler> logger)
        {
            _amenityService = amenityService;
            _amenityProvider = amenityProvider;
            _logger = logger;
        }

        public async Task<int> Handle(CreateAmenityCommand request, CancellationToken cancellationToken)
        {

            if (await _amenityProvider.AmenityExistsByName(request.Name,cancellationToken))
                throw new ValidationException("Name",$"Udogodnienie o nazwie {request.Name} już istnieje.");
            
            _logger.LogInformation("Dodawanie nowego udogodnienia: {Name}", request.Name);

            var amenity = request.Adapt<Amenity>();

            await _amenityService.CreateAmenity(amenity, cancellationToken);

            _logger.LogInformation("Dodano udogodnienie ID: {AmenityId}", amenity.AmenityId);

            return amenity.AmenityId;
        }
    }
}


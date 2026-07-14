using HotelManageSys.API.Exceptions;
using HotelManageSys.API.Features.Amenities.DTO_s;
using HotelManageSys.API.Features.Amenities.Messages.Queries;
using HotelManageSys.API.Features.Amenities.Providers;
using Mapster;
using MediatR;

namespace HotelManageSys.API.Features.Amenities.Handlers.Queries
{
    public class GetAmenityByIdHandler : IRequestHandler<GetAmenityByIdQuery, AmenityDTO?>
    {
        private readonly IAmenityProvider _amenityProvider;

        public GetAmenityByIdHandler(IAmenityProvider amenityProvider)
        {
            _amenityProvider = amenityProvider;
        }

        public async Task<AmenityDTO?> Handle(GetAmenityByIdQuery request, CancellationToken cancellationToken)
        {
            var amenity = await _amenityProvider.GetAmenityByIdAsync(request.Id, true, cancellationToken);
            
            if (amenity == null) throw new NotFoundException("Amenity",request.Id);

            return amenity.Adapt<AmenityDTO>();
        }
    }
}


using HotelManageSys.API.Features.Amenities.DTO_s;
using HotelManageSys.API.Features.Amenities.Messages.Queries;
using HotelManageSys.API.Features.Amenities.Providers;
using Mapster;
using MediatR;

namespace HotelManageSys.API.Features.Amenities.Handlers.Queries
{
    public class GetAllAmenitiesHandler : IRequestHandler<GetAllAmenitiesQuery, IEnumerable<AmenityDTO>>
    {
        private readonly IAmenityProvider _amenityProvider;

        public GetAllAmenitiesHandler(IAmenityProvider amenityProvider)
        {
            _amenityProvider = amenityProvider;
        }

        public async Task<IEnumerable<AmenityDTO>> Handle(GetAllAmenitiesQuery request, CancellationToken cancellationToken)
        {
            return (await _amenityProvider.GetAllAmenitiesAsync(cancellationToken)).Adapt<IEnumerable<AmenityDTO>>();
        }
    }
}


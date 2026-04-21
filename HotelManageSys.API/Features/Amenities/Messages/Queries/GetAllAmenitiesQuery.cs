using HotelManageSys.API.Features.Amenities.DTO_s;
using MediatR;

namespace HotelManageSys.API.Features.Amenities.Messages.Queries
{
    public class GetAllAmenitiesQuery : IRequest<IEnumerable<AmenityDTO>>
    {
    }
}


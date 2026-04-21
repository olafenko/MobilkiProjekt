using HotelManageSys.API.Features.Amenities.DTO_s;
using MediatR;

namespace HotelManageSys.API.Features.Amenities.Messages.Queries
{
    public class GetAmenityByIdQuery : IRequest<AmenityDTO>
    {
        public int Id { get; set; }

        public GetAmenityByIdQuery(int id)
        {
            Id = id;
        }
    }
}


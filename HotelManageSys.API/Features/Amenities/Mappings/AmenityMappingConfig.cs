using HotelManageSys.API.Features.Amenities.DTO_s;
using HotelManageSys.API.Features.Amenities.Messages.Commands;
using HotelManageSys.API.Models;
using Mapster;

namespace HotelManageSys.API.Features.Amenities.Mappings
{
    public class AmenityMappingConfig : IRegister
    {
        public void Register(TypeAdapterConfig config)
        {
            config.NewConfig<Amenity, AmenityDTO>();

            config.NewConfig<CreateAmenityCommand, Amenity>()
                .Ignore(d => d.AmenityId)
                .Ignore(d => d.Rooms);
        }
    }
}


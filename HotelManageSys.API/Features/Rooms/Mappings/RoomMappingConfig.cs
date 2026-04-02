using HotelManageSys.API.Features.Rooms.Messages.Queries;
using HotelManageSys.API.Models;
using Mapster;

namespace HotelManageSys.API.Features.Rooms.Mappings
{
    public class RoomMappingConfig : IRegister
    {
        public void Register(TypeAdapterConfig config)
        {
            config.NewConfig<Room, RoomDTO>()
                .Map(d => d.RoomTypeName, src => src.RoomType != null ? src.RoomType.Name : null)
                .Map(d => d.BasePrice, src => src.RoomType != null ? src.RoomType.BasePrice : 0)
                .Map(d => d.AmenitiesNames, src => src.Amenities.Select(a => a.Name).ToList())
                .Map(d => d.Status, src => src.Status.ToString());

        }
    }
}

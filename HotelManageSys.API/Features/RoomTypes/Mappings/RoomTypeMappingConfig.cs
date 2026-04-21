using HotelManageSys.API.Features.RoomTypes.DTO_s;
using HotelManageSys.API.Models;
using Mapster;

namespace HotelManageSys.API.Features.RoomTypes.Mappings
{
    public class RoomTypeMappingConfig : IRegister
    {
        public void Register(TypeAdapterConfig config)
        {
            config.NewConfig<RoomType, RoomTypeDTO>();
                
        }
    }
}

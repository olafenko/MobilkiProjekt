using HotelManageSys.API.Features.Guests.DTO_s;
using HotelManageSys.API.Features.Guests.Messages.Commands;
using HotelManageSys.API.Models;
using Mapster;

namespace HotelManageSys.API.Features.Guests.Mappings
{
    public class GuestMappingConfig : IRegister
    {
        public void Register(TypeAdapterConfig config)
        {
            config.NewConfig<Guest, GuestDTO>();

            config.NewConfig<CreateGuestCommand, Guest>()
                .Ignore(d => d.GuestId)
                .Ignore(d => d.Reservations);
        }
    }
}


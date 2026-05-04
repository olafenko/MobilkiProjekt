using HotelManageSys.API.Features.Reservations.DTO_s;
using HotelManageSys.API.Models;
using HotelManageSys.API.Models.Enums;
using Mapster;

namespace HotelManageSys.API.Features.ReservationAdditionalOffers.Mappings
{
    public class ReservationAdditionalOffersMappingConfig : IRegister
    {
        public void Register(TypeAdapterConfig config)
        {
            config.NewConfig<ReservationAdditionalOffer, ReservationAdditionalOfferDTO>()
                .Map(d => d.AdditionalOfferName, src => src.AdditionalOffer != null ? src.AdditionalOffer.Name : null);


        }
    }
}

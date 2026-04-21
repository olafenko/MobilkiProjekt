using HotelManageSys.API.Features.AdditionalOffers.DTO_s;
using HotelManageSys.API.Features.AdditionalOffers.Messages.Commands;
using HotelManageSys.API.Models;
using Mapster;

namespace HotelManageSys.API.Features.AdditionalOffers.Mappings
{
    public class AdditionalOfferMappingConfig : IRegister
    {
        public void Register(TypeAdapterConfig config)
        {
            config.NewConfig<AdditionalOffer, AdditionalOfferDTO>();

            config.NewConfig<CreateAdditionalOfferCommand, AdditionalOffer>()
                .Ignore(d => d.AdditionalOfferId)
                .Ignore(d => d.ReservationAdditionalOffers);
        }
    }
}


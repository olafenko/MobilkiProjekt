using HotelManageSys.API.Models;

namespace HotelManageSys.API.Features.AdditionalOffers.Services
{
    public interface IAdditionalOfferService
    {
        Task CreateAdditionalOffer(AdditionalOffer additionalOffer, CancellationToken cancellationToken = default);
        Task UpdateAdditionalOffer(AdditionalOffer additionalOffer, CancellationToken cancellationToken = default);
        Task DeleteAdditionalOffer(AdditionalOffer additionalOffer, CancellationToken cancellationToken = default);
    }
}


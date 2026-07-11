using HotelManageSys.API.Models;

namespace HotelManageSys.API.Features.AdditionalOffers.Providers
{
    public interface IAdditionalOfferProvider
    {
        Task<IEnumerable<AdditionalOffer>> GetAllAdditionalOffersAsync(CancellationToken cancellationToken = default);

        Task<AdditionalOffer?> GetAdditionalOfferByIdAsync(int additionalOfferId, bool asNoTracking = true, CancellationToken cancellationToken = default);
        Task<bool> AdditionalOfferExistsByName(string name, CancellationToken cancellationToken = default);
    }
}

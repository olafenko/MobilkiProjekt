using HotelManageSys.API.Models;
using HotelManageSys.API.Models.Data;
using Microsoft.EntityFrameworkCore;

namespace HotelManageSys.API.Features.AdditionalOffers.Providers
{
    public class AdditionalOfferProvider : IAdditionalOfferProvider
    {
        private readonly ApplicationDbContext _dbContext;

        public AdditionalOfferProvider(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<IEnumerable<AdditionalOffer>> GetAllAdditionalOffersAsync(CancellationToken cancellationToken = default)
        {
            return await _dbContext.AdditionalOffers
                .AsNoTracking()
                .Include(o => o.ReservationAdditionalOffers)
                .Where(o => o.IsActive)
                .OrderBy(o => o.Name)
                .ToListAsync(cancellationToken);
        }

        public async Task<AdditionalOffer> GetAdditionalOfferByIdAsync(int additionalOfferId, bool asNoTracking = true, CancellationToken cancellationToken = default)
        {
            IQueryable<AdditionalOffer> query = _dbContext.AdditionalOffers
                .Include(o => o.ReservationAdditionalOffers);

            if (asNoTracking)
            {
                query = query.AsNoTracking();
            }

            var additionalOffer = await query.FirstOrDefaultAsync(
                o => o.IsActive && o.AdditionalOfferId == additionalOfferId,
                cancellationToken
            );

            return additionalOffer ?? throw new KeyNotFoundException($"Nie znaleziono oferty dodatkowej o ID {additionalOfferId}");
        }
    }
}


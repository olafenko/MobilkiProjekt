using HotelManageSys.API.Models;
using HotelManageSys.API.Models.Data;

namespace HotelManageSys.API.Features.AdditionalOffers.Services
{
    public class AdditionalOfferService : IAdditionalOfferService
    {
        private readonly ApplicationDbContext _context;

        public AdditionalOfferService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task CreateAdditionalOffer(AdditionalOffer additionalOffer, CancellationToken cancellationToken = default)
        {
            _context.Add(additionalOffer);
            await _context.SaveChangesAsync(cancellationToken);
        }

        public async Task UpdateAdditionalOffer(AdditionalOffer additionalOffer, CancellationToken cancellationToken = default)
        {
            await _context.SaveChangesAsync(cancellationToken);
        }

        public async Task DeleteAdditionalOffer(AdditionalOffer additionalOffer, CancellationToken cancellationToken = default)
        {
            additionalOffer.IsActive = false;
            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}


using HotelManageSys.API.Models;
using HotelManageSys.API.Models.Data;
using Microsoft.EntityFrameworkCore;

namespace HotelManageSys.API.Features.Guests.Providers
{
    public class GuestProvider : IGuestProvider
    {
        private readonly ApplicationDbContext _dbContext;

        public GuestProvider(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<IEnumerable<Guest>> GetAllGuestsAsync(CancellationToken cancellationToken = default)
        {
            return await _dbContext.Guests
                .AsNoTracking()
                .Include(g => g.Reservations)
                .Where(g => g.IsActive)
                .OrderBy(g => g.LastName)
                .ThenBy(g => g.FirstName)
                .ToListAsync(cancellationToken);
        }

        public async Task<Guest> GetGuestByIdAsync(int guestId, bool asNoTracking = true, CancellationToken cancellationToken = default)
        {
            IQueryable<Guest> query = _dbContext.Guests
                .Include(g => g.Reservations);

            if (asNoTracking)
            {
                query = query.AsNoTracking();
            }

            var guest = await query.FirstOrDefaultAsync(g => g.IsActive && g.GuestId == guestId, cancellationToken);

            return guest ?? throw new KeyNotFoundException($"Nie znaleziono gościa o ID {guestId}");
        }
    }
}


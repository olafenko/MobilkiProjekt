using HotelManageSys.API.Models;
using HotelManageSys.API.Models.Data;

namespace HotelManageSys.API.Features.Guests.Services
{
    public class GuestService : IGuestService
    {
        private readonly ApplicationDbContext _context;

        public GuestService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task CreateGuest(Guest guest, CancellationToken cancellationToken = default)
        {
            _context.Add(guest);
            await _context.SaveChangesAsync(cancellationToken);
        }

        public async Task UpdateGuest(Guest guest, CancellationToken cancellationToken = default)
        {
            await _context.SaveChangesAsync(cancellationToken);
        }

        public async Task DeleteGuest(Guest guest, CancellationToken cancellationToken = default)
        {
            guest.IsActive = false;
            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}


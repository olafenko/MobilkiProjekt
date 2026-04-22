using HotelManageSys.API.Models;

namespace HotelManageSys.API.Features.Guests.Providers
{
    public interface IGuestProvider
    {
        Task<IEnumerable<Guest>> GetAllGuestsAsync(CancellationToken cancellationToken = default);

        Task<Guest> GetGuestByIdAsync(int guestId, bool asNoTracking = true, CancellationToken cancellationToken = default);
    }
}


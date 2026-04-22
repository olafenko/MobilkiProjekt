using HotelManageSys.API.Models;

namespace HotelManageSys.API.Features.Guests.Services
{
    public interface IGuestService
    {
        Task CreateGuest(Guest guest, CancellationToken cancellationToken = default);
        Task UpdateGuest(Guest guest, CancellationToken cancellationToken = default);
        Task DeleteGuest(Guest guest, CancellationToken cancellationToken = default);
    }
}


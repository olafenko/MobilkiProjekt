using HotelManageSys.API.Models;

namespace HotelManageSys.API.Features.Guests.Providers
{
    public interface IGuestProvider
    {
        Task<IEnumerable<Guest>> GetAllGuestsAsync(CancellationToken cancellationToken = default);

        Task<Guest?> GetGuestByIdAsync(int guestId, bool asNoTracking = true, CancellationToken cancellationToken = default);
        Task<bool> GuestExistsByEmail(string email, CancellationToken cancellationToken = default);
        Task<bool> GuestExistsByEmail(string email, int guestId, CancellationToken cancellationToken = default);
        Task<bool> GuestExistsByPhoneNumber(string phoneNumber, CancellationToken cancellationToken = default);
        Task<bool> GuestExistsByPhoneNumber(string phoneNumber, int guestId, CancellationToken cancellationToken = default);
        Task<bool> GuestExistsByIdentityCardNumber(string identityCardNumber, CancellationToken cancellationToken = default);
        Task<bool> GuestExistsByIdentityCardNumber(string identityCardNumber, int guestId, CancellationToken cancellationToken = default);
        Task<bool> GuestExistsById(int? guestId, CancellationToken cancellationToken = default);

    }
}


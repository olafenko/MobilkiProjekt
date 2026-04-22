using HotelManageSys.API.Models;

namespace HotelManageSys.API.Features.Reservations.Providers
{
    public interface IReservationProvider
    {
        Task<IEnumerable<Reservation>> GetAllReservationsAsync(CancellationToken cancellationToken = default);

        Task<Reservation> GetReservationByIdAsync(int reservationId, bool asNoTracking = true, CancellationToken cancellationToken = default);
    }
}


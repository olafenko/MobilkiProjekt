using HotelManageSys.API.Models;

namespace HotelManageSys.API.Features.Reservations.Services
{
    public interface IReservationService
    {
        Task CreateReservation(Reservation reservation, CancellationToken cancellationToken = default);
        Task UpdateReservation(Reservation reservation, CancellationToken cancellationToken = default);
        Task DeleteReservation(Reservation reservation, CancellationToken cancellationToken = default);
    }
}


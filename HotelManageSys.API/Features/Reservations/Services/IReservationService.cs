using HotelManageSys.API.Features.Reservations.Messages.Commands;
using HotelManageSys.API.Models;

namespace HotelManageSys.API.Features.Reservations.Services
{
    public interface IReservationService
    {
        Task<int> CreateReservation(CreateReservationCommand reservationCommand, CancellationToken cancellationToken = default);
        Task UpdateReservation(UpdateReservationCommand updateReservationCommand, CancellationToken cancellationToken = default);
        Task DeleteReservation(Reservation reservation, CancellationToken cancellationToken = default);
    }
}


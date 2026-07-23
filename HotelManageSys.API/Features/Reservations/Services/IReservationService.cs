using HotelManageSys.API.Features.Reservations.Messages.Commands;
using HotelManageSys.API.Models;

namespace HotelManageSys.API.Features.Reservations.Services
{
    public interface IReservationService
    {
        Task DeleteReservation(Reservation reservation, CancellationToken cancellationToken = default);
    }
}


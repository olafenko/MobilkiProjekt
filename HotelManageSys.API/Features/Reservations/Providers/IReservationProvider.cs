using HotelManageSys.API.Models;
using HotelManageSys.API.Models.Enums;

namespace HotelManageSys.API.Features.Reservations.Providers
{
    public interface IReservationProvider
    {
        Task<IEnumerable<Reservation>> GetAllReservationsAsync(PaymentStatus? paymentStatus = null, CancellationToken cancellationToken = default);

        Task<Reservation?> GetReservationByIdAsync(int reservationId, bool asNoTracking = true, CancellationToken cancellationToken = default);

        Task<bool> IsRoomOccupiedForDate(int roomId, DateTime checkIn, DateTime checkOut,CancellationToken cancellationToken = default);
        Task<bool> IsRoomOccupiedForDate(int roomId,int reservationId, DateTime checkIn, DateTime checkOut,CancellationToken cancellationToken = default);
    }
}


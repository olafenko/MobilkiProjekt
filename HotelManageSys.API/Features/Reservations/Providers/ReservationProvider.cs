using HotelManageSys.API.Models;
using HotelManageSys.API.Models.Data;
using HotelManageSys.API.Models.Enums;
using Microsoft.EntityFrameworkCore;

namespace HotelManageSys.API.Features.Reservations.Providers
{
    public class ReservationProvider : IReservationProvider
    {
        private readonly ApplicationDbContext _dbContext;

        public ReservationProvider(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<IEnumerable<Reservation>> GetAllReservationsAsync(PaymentStatus? paymentStatus = null, CancellationToken cancellationToken = default)
        {
            IQueryable<Reservation> query = _dbContext.Reservations
                .AsNoTracking()
                .Include(r => r.Guest)
                .Include(r => r.Room)
                    .ThenInclude(r => r.RoomType)
                .Include(r => r.Worker)
                .Include(r => r.Payments)
                .Include(r => r.ReservationAdditionalOffers)
                    .ThenInclude(rao => rao.AdditionalOffer)
                .Where(r => r.IsActive);

            if (paymentStatus != null)
            {
                if(paymentStatus == PaymentStatus.UNPAID)
                {
                    query = query.Where(r => !r.Payments.Any(p => p.PaymentStatus == PaymentStatus.PAID));
                } else
                {
                    query = query.Where(r => r.Payments.Any(p => p.PaymentStatus == paymentStatus.Value));
                }

            }

                return await query
                    .OrderByDescending(r => r.ReservationDate)
                    .ToListAsync(cancellationToken);
        }

        public async Task<Reservation?> GetReservationByIdAsync(int reservationId, bool asNoTracking = true, CancellationToken cancellationToken = default)
        {
            IQueryable<Reservation> query = _dbContext.Reservations
                .Include(r => r.Guest)
                .Include(r => r.Room)
                    .ThenInclude(r => r.RoomType)
                .Include(r => r.Worker)
                .Include(r => r.Payments)
                .Include(r => r.ReservationAdditionalOffers)
                    .ThenInclude(rao => rao.AdditionalOffer);

            if (asNoTracking)
            {
                query = query.AsNoTracking();
            }

            return await query.FirstOrDefaultAsync(r => r.IsActive && r.ReservationId == reservationId, cancellationToken);
        }

        public async Task<bool> IsRoomOccupiedForDate(int roomId, DateTime checkIn, DateTime checkOut, CancellationToken cancellationToken = default)
        {
            return await _dbContext.Reservations.AnyAsync(r => r.RoomId == roomId && r.IsActive
                && checkIn > r.CheckInDate && checkIn < r.CheckOutDate
                && checkOut > r.CheckInDate && checkOut < r.CheckOutDate, cancellationToken);
        }
    }
}


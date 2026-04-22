using HotelManageSys.API.Models;
using HotelManageSys.API.Models.Data;
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

        public async Task<IEnumerable<Reservation>> GetAllReservationsAsync(CancellationToken cancellationToken = default)
        {
            return await _dbContext.Reservations
                .AsNoTracking()
                .Include(r => r.Guest)
                .Include(r => r.Room)
                .Include(r => r.Worker)
                .Include(r => r.Payments)
                .Include(r => r.ReservationAdditionalOffers)
                    .ThenInclude(rao => rao.AdditionalOffer)
                .Where(r => r.IsActive)
                .OrderByDescending(r => r.ReservationDate)
                .ToListAsync(cancellationToken);
        }

        public async Task<Reservation> GetReservationByIdAsync(int reservationId, bool asNoTracking = true, CancellationToken cancellationToken = default)
        {
            IQueryable<Reservation> query = _dbContext.Reservations
                .Include(r => r.Guest)
                .Include(r => r.Room)
                .Include(r => r.Worker)
                .Include(r => r.Payments)
                .Include(r => r.ReservationAdditionalOffers)
                    .ThenInclude(rao => rao.AdditionalOffer);

            if (asNoTracking)
            {
                query = query.AsNoTracking();
            }

            var reservation = await query.FirstOrDefaultAsync(r => r.IsActive && r.ReservationId == reservationId, cancellationToken);

            return reservation ?? throw new KeyNotFoundException($"Nie znaleziono rezerwacji o ID {reservationId}");
        }
    }
}


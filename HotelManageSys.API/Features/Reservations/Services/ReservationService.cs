using HotelManageSys.API.Models;
using HotelManageSys.API.Models.Data;

namespace HotelManageSys.API.Features.Reservations.Services
{
    public class ReservationService : IReservationService
    {
        private readonly ApplicationDbContext _context;

        public ReservationService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task CreateReservation(Reservation reservation, CancellationToken cancellationToken = default)
        {
            _context.Add(reservation);
            await _context.SaveChangesAsync(cancellationToken);
        }

        public async Task UpdateReservation(Reservation reservation, CancellationToken cancellationToken = default)
        {
            await _context.SaveChangesAsync(cancellationToken);
        }

        public async Task DeleteReservation(Reservation reservation, CancellationToken cancellationToken = default)
        {
            reservation.IsActive = false;
            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}


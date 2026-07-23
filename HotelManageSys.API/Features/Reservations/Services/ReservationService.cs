using HotelManageSys.API.Features.Reservations.Providers;
using HotelManageSys.API.Features.Rooms.Providers;
using HotelManageSys.API.Models;
using HotelManageSys.API.Models.Data;

namespace HotelManageSys.API.Features.Reservations.Services
{
    public class ReservationService : IReservationService
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<ReservationService> _logger;
        private readonly IReservationProvider _reservationProvider;
        private readonly IRoomProvider _roomProvider;

        public ReservationService(ApplicationDbContext context, ILogger<ReservationService> logger, IReservationProvider reservationProvider, IRoomProvider roomProvider)
        {
            _context = context;
            _logger = logger;
            _reservationProvider = reservationProvider;
            _roomProvider = roomProvider;
        }
        
        public async Task DeleteReservation(Reservation reservation, CancellationToken cancellationToken = default)
        {

            foreach (var additionalOffer in reservation.ReservationAdditionalOffers)
            {
                additionalOffer.IsActive = false;
            }

            reservation.IsActive = false;
            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}


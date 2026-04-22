using HotelManageSys.API.Features.Reservations.Messages.Commands;
using HotelManageSys.API.Features.Reservations.Services;
using HotelManageSys.API.Models;
using Mapster;
using MediatR;

namespace HotelManageSys.API.Features.Reservations.Handlers.Commands
{
    public class CreateReservationHandler : IRequestHandler<CreateReservationCommand, int>
    {
        private readonly IReservationService _reservationService;
        private readonly ILogger<CreateReservationHandler> _logger;

        public CreateReservationHandler(IReservationService reservationService, ILogger<CreateReservationHandler> logger)
        {
            _reservationService = reservationService;
            _logger = logger;
        }

        public async Task<int> Handle(CreateReservationCommand request, CancellationToken cancellationToken)
        {
            _logger.LogInformation("Dodawanie nowej rezerwacji dla gościa ID: {GuestId}", request.GuestId);

            var reservation = request.Adapt<Reservation>();

            await _reservationService.CreateReservation(reservation, cancellationToken);

            _logger.LogInformation("Dodano rezerwację ID: {ReservationId}", reservation.ReservationId);

            return reservation.ReservationId;
        }
    }
}


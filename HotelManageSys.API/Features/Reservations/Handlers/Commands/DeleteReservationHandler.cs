using HotelManageSys.API.Features.Reservations.Messages.Commands;
using HotelManageSys.API.Features.Reservations.Providers;
using HotelManageSys.API.Features.Reservations.Services;
using MediatR;

namespace HotelManageSys.API.Features.Reservations.Handlers.Commands
{
    public class DeleteReservationHandler : IRequestHandler<DeleteReservationCommand, Unit>
    {
        private readonly IReservationService _reservationService;
        private readonly ILogger<DeleteReservationHandler> _logger;
        private readonly IReservationProvider _reservationProvider;

        public DeleteReservationHandler(IReservationService reservationService, ILogger<DeleteReservationHandler> logger, IReservationProvider reservationProvider)
        {
            _reservationService = reservationService;
            _logger = logger;
            _reservationProvider = reservationProvider;
        }

        public async Task<Unit> Handle(DeleteReservationCommand request, CancellationToken cancellationToken)
        {
            var reservation = await _reservationProvider.GetReservationByIdAsync(request.Id, false, cancellationToken);

            _logger.LogInformation("Usuwanie rezerwacji ID: {ReservationId}", request.Id);

            await _reservationService.DeleteReservation(reservation, cancellationToken);

            _logger.LogInformation("Usunięto rezerwację ID: {ReservationId}", request.Id);

            return Unit.Value;
        }
    }
}


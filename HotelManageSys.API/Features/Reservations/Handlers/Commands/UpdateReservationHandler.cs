using HotelManageSys.API.Features.Reservations.Messages.Commands;
using HotelManageSys.API.Features.Reservations.Providers;
using HotelManageSys.API.Features.Reservations.Services;
using Mapster;
using MediatR;

namespace HotelManageSys.API.Features.Reservations.Handlers.Commands
{
    public class UpdateReservationHandler : IRequestHandler<UpdateReservationCommand, Unit>
    {
        private readonly IReservationService _reservationService;
        private readonly ILogger<UpdateReservationHandler> _logger;
        private readonly IReservationProvider _reservationProvider;

        public UpdateReservationHandler(IReservationService reservationService, ILogger<UpdateReservationHandler> logger, IReservationProvider reservationProvider)
        {
            _reservationService = reservationService;
            _logger = logger;
            _reservationProvider = reservationProvider;
        }

        public async Task<Unit> Handle(UpdateReservationCommand request, CancellationToken cancellationToken)
        {
            var reservation = await _reservationProvider.GetReservationByIdAsync(request.ReservationId, false, cancellationToken);

            _logger.LogInformation("Aktualizowanie rezerwacji ID: {ReservationId}", request.ReservationId);

            request.Adapt(reservation);

            await _reservationService.UpdateReservation(reservation, cancellationToken);

            _logger.LogInformation("Zaaktualizowano rezerwację ID: {ReservationId}", request.ReservationId);

            return Unit.Value;
        }
    }
}


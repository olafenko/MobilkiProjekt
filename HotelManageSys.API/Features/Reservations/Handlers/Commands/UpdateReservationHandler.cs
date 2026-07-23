using HotelManageSys.API.Exceptions;
using HotelManageSys.API.Features.AdditionalOffers.Providers;
using HotelManageSys.API.Features.Guests.Providers;
using HotelManageSys.API.Features.Guests.Services;
using HotelManageSys.API.Features.Reservations.Messages.Commands;
using HotelManageSys.API.Features.Reservations.Providers;
using HotelManageSys.API.Features.Rooms.Providers;
using HotelManageSys.API.Features.Workers.Providers;
using HotelManageSys.API.Models.Data;
using Mapster;
using MediatR;

namespace HotelManageSys.API.Features.Reservations.Handlers.Commands
{
    public class UpdateReservationHandler : IRequestHandler<UpdateReservationCommand, Unit>
    {
        
        private readonly IReservationProvider _reservationProvider;
        private readonly IRoomProvider _roomProvider;
        private readonly ApplicationDbContext _context;
        private readonly ILogger<UpdateReservationHandler> _logger;


        public UpdateReservationHandler(IReservationProvider reservationProvider, IRoomProvider roomProvider, ApplicationDbContext context, ILogger<UpdateReservationHandler> logger)
        {
            _reservationProvider = reservationProvider;
            _roomProvider = roomProvider;
            _context = context;
            _logger = logger;
        }


        public async Task<Unit> Handle(UpdateReservationCommand request, CancellationToken cancellationToken)
        {

            _logger.LogInformation("Aktualizowanie rezerwacji ID: {ReservationId}", request.ReservationId);

            var existingReservation = await _reservationProvider.GetReservationByIdAsync(request.ReservationId, false, cancellationToken);

            if (existingReservation == null) throw new NotFoundException("Reservation", request.ReservationId);
            
            var nights = (int)Math.Ceiling((request.CheckOutDate - request.CheckInDate).TotalDays);

            if (await _reservationProvider.IsRoomOccupiedForDate(request.RoomId, request.ReservationId, request.CheckInDate, request.CheckOutDate, cancellationToken))
                throw new UniqueConstraintException("Room", $"Pokój jest zajęty w terminie od {request.CheckInDate} do {request.CheckOutDate}");
            
            var room = await _roomProvider.GetRoomByIdAsync(request.RoomId,true,cancellationToken);
            if (room == null) throw new NotFoundException("Room", request.RoomId);
            
            decimal newRoomCost = room.RoomType.BasePrice * nights;

            decimal existingOffersCost = existingReservation.ReservationAdditionalOffers
                .Where(rao => rao.IsActive)
                .Sum(rao => rao.OfferPrice * rao.Quantity);
            
            decimal updatedTotalPrice = newRoomCost + existingOffersCost;

            request.Adapt(existingReservation);

            existingReservation.TotalPrice = updatedTotalPrice;
            
            await _context.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("Zaktualizowano rezerwację {ReservationId}. Nowa kwota: {Price}", existingReservation.ReservationId, updatedTotalPrice);

            return Unit.Value;
        }
    }
}


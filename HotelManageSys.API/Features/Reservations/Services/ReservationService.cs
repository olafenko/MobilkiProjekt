using Azure.Core;
using HotelManageSys.API.Features.ReservationAdditionalOffers;
using HotelManageSys.API.Features.Reservations.Handlers.Commands;
using HotelManageSys.API.Features.Reservations.Messages.Commands;
using HotelManageSys.API.Features.Reservations.Providers;
using HotelManageSys.API.Features.Rooms.Providers;
using HotelManageSys.API.Models;
using HotelManageSys.API.Models.Data;
using Mapster;
using Microsoft.EntityFrameworkCore;

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
        
        public async Task UpdateReservation(UpdateReservationCommand request, CancellationToken cancellationToken = default)
        {

            var existingReservation = await _reservationProvider.GetReservationByIdAsync(request.ReservationId, false, cancellationToken);

            var nights = (int)Math.Ceiling((request.CheckOutDate - request.CheckInDate).TotalDays);
            if (nights < 0) throw new ArgumentException("Data wymeldowania musi być późniejsza niż data zameldowania.");

            var isRoomOccupied = await _context.Reservations
                .AnyAsync(r => r.RoomId == request.RoomId
                            && r.IsActive
                            && r.ReservationId != request.ReservationId
                            && request.CheckInDate < r.CheckOutDate
                            && request.CheckOutDate > r.CheckInDate, cancellationToken);

            if (isRoomOccupied) throw new ArgumentException("Pokój jest zajęty w wybranym terminie.");

            var room = await _roomProvider.GetRoomByIdAsync(request.RoomId,true,cancellationToken);

            decimal newRoomCost = room.RoomType.BasePrice * nights;

            decimal existingOffersCost = existingReservation.ReservationAdditionalOffers
                .Where(rao => rao.IsActive)
                .Sum(rao => rao.OfferPrice * rao.Quantity);

            decimal updatedTotalPrice = newRoomCost + existingOffersCost;

            request.Adapt(existingReservation);

            existingReservation.TotalPrice = updatedTotalPrice;

            await _context.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("Zaktualizowano rezerwację {ReservationId}. Nowa kwota: {Price}", existingReservation.ReservationId, updatedTotalPrice);
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


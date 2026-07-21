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

        public async Task<int> CreateReservation(CreateReservationCommand request, CancellationToken cancellationToken = default)
        {

            var workerExists = await _context.Workers.AnyAsync(w => w.WorkerId == request.WorkerId && w.IsActive, cancellationToken);
            if (!workerExists) throw new ArgumentException($"Nie znaleziono pracownika o ID{request.WorkerId}");
            
            var isRoomOccupied = await _context.Reservations.AnyAsync(r => r.RoomId == request.RoomId && r.IsActive
                    && request.CheckInDate > r.CheckInDate && request.CheckInDate < r.CheckOutDate
                    && request.CheckOutDate > r.CheckInDate && request.CheckOutDate < r.CheckOutDate, cancellationToken);

            if (isRoomOccupied) throw new ArgumentException("Pokój jest zajęty w wybranym terminie.");

          
            var additionalOffersIds = request.AdditionalOffers.Select(o => o.AdditionalOfferId).ToList();

            var additionalOffers = await _context.AdditionalOffers.Where(o => additionalOffersIds.Contains(o.AdditionalOfferId))
                .ToDictionaryAsync(o => o.AdditionalOfferId, cancellationToken);

            if (additionalOffers.Count > 0)
            {
                foreach (var additionalOfferDTO in request.AdditionalOffers)
                {
                    if (!additionalOffers.ContainsKey(additionalOfferDTO.AdditionalOfferId))
                        throw new ArgumentException($"Oferta dodatkowa o ID {additionalOfferDTO.AdditionalOfferId} nie istnieje.");

                    if (!additionalOffers[additionalOfferDTO.AdditionalOfferId].IsActive)
                        throw new ArgumentException($"Oferta dodatkowa o ID {additionalOffers[additionalOfferDTO.AdditionalOfferId].Name} jest nie aktywna.");

                    if (additionalOfferDTO.Quantity < 0)
                        throw new ArgumentException("Ilość oferty musi być większa niż 0");

                }

            }


            using var transaction = await _context.Database.BeginTransactionAsync(cancellationToken);


            try
            {

                if (request.GuestId.HasValue)
                {
                    var guestExists = await _context.Guests.AnyAsync(g => g.GuestId == request.GuestId && g.IsActive, cancellationToken);
                    if (!guestExists) throw new ArgumentException($"Gość o ID {request.GuestId} nie istnieje.");

                }
                else if (request.NewGuest != null)
                {
                    var newGuest = request.NewGuest.Adapt<Guest>();
                    _context.Guests.Add(newGuest);
                    await _context.SaveChangesAsync(cancellationToken);
                    _logger.LogInformation("Dodano dane gościa o ID {GuestId}", newGuest.GuestId);
                    request.GuestId = newGuest.GuestId;

                }
                else throw new ArgumentException("Do stworzenia rezerwacji muszą zostać podane dane gościa.");

                var room = await _context.Rooms.Include(r => r.RoomType).FirstOrDefaultAsync(r => r.RoomId == request.RoomId && r.IsActive);
                var nights = (int)Math.Ceiling((request.CheckOutDate - request.CheckInDate).TotalDays);
                var totalPrice = room.RoomType.BasePrice * nights;

                var reservation = request.Adapt<Reservation>();
                reservation.GuestId = request.GuestId.Value;

                foreach (var additionalOfferDTO in request.AdditionalOffers)
                {

                    var additionalOffer = additionalOffers[additionalOfferDTO.AdditionalOfferId];

                    var reservationAdditionalOffer = additionalOfferDTO.Adapt<ReservationAdditionalOffer>();

                    reservationAdditionalOffer.OfferPrice = additionalOffer.Price;

                    totalPrice += additionalOffer.Price * additionalOfferDTO.Quantity;

                    reservation.ReservationAdditionalOffers.Add(reservationAdditionalOffer);

                }

                reservation.TotalPrice = totalPrice;
                _context.Reservations.Add(reservation);

                await _context.SaveChangesAsync(cancellationToken);
                await transaction.CommitAsync(cancellationToken);

                _logger.LogInformation("Utworzono rezerwacje. Wykupione dodatkowe usługi: {Offers}",additionalOffers.Values);

                return reservation.ReservationId;

            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync(cancellationToken);
                _logger.LogError(ex, "Błąd podczas tworzenia rezerwacji");
                throw;
            }

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


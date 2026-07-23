using HotelManageSys.API.Exceptions;
using HotelManageSys.API.Features.AdditionalOffers.Providers;
using HotelManageSys.API.Features.Guests.Providers;
using HotelManageSys.API.Features.Guests.Services;
using HotelManageSys.API.Features.Reservations.Messages.Commands;
using HotelManageSys.API.Features.Reservations.Providers;
using HotelManageSys.API.Features.Reservations.Services;
using HotelManageSys.API.Features.Rooms.Providers;
using HotelManageSys.API.Features.Workers.Providers;
using HotelManageSys.API.Models;
using HotelManageSys.API.Models.Data;
using Mapster;
using MediatR;

namespace HotelManageSys.API.Features.Reservations.Handlers.Commands
{
    public class CreateReservationHandler : IRequestHandler<CreateReservationCommand, int>
    {
        private readonly IReservationProvider _reservationProvider;
        private readonly IWorkerProvider _workerProvider;
        private readonly IAdditionalOfferProvider _additionalOfferProvider;
        private readonly IGuestProvider _guestProvider;
        private readonly IGuestService _guestService;
        private readonly IRoomProvider _roomProvider;
        private readonly ILogger<CreateReservationHandler> _logger;
        private readonly ApplicationDbContext _context;

        public CreateReservationHandler(IReservationProvider reservationProvider, IWorkerProvider workerProvider, IAdditionalOfferProvider additionalOfferProvider, IGuestProvider guestProvider, IGuestService guestService, IRoomProvider roomProvider, ILogger<CreateReservationHandler> logger, ApplicationDbContext context)
        {
            _reservationProvider = reservationProvider;
            _workerProvider = workerProvider;
            _additionalOfferProvider = additionalOfferProvider;
            _guestProvider = guestProvider;
            _guestService = guestService;
            _roomProvider = roomProvider;
            _logger = logger;
            _context = context;
        }

        public async Task<int> Handle(CreateReservationCommand request, CancellationToken cancellationToken)
        {
            _logger.LogInformation("Dodawanie nowej rezerwacji dla gościa ID: {GuestId}", request.GuestId);

            var worker = await _workerProvider.GetWorkerByIdAsync(request.WorkerId,false,cancellationToken);
            if (worker == null) throw new NotFoundException("Worker",request.WorkerId);

            if (await _reservationProvider.IsRoomOccupiedForDate(request.RoomId,request.CheckInDate,request.CheckOutDate,cancellationToken))
                throw new UniqueConstraintException("Room",$"Pokój jest zajęty w terminie od {request.CheckInDate} do {request.CheckOutDate}");
            
            var additionalOffersIds = request.AdditionalOffers.Select(o => o.AdditionalOfferId).ToList();
            
            var additionalOffers = await _additionalOfferProvider.GetAdditionalOffersByIdsAsync(additionalOffersIds,true,cancellationToken);

            if (additionalOffers.Count > 0)
            {
                foreach (var additionalOfferDTO in request.AdditionalOffers)
                {
                    if (!additionalOffers.ContainsKey(additionalOfferDTO.AdditionalOfferId))
                        throw new NotFoundException("AdditionalOffer",additionalOfferDTO.AdditionalOfferId);
                }

            }
            
            using var transaction = await _context.Database.BeginTransactionAsync(cancellationToken);
            
            try
            {

                if (request.GuestId.HasValue)
                {
                    if (!await _guestProvider.GuestExistsById(request.GuestId, cancellationToken))
                        throw new NotFoundException("Guest",request.GuestId);
                }
                else if (request.NewGuest != null)
                {
                    var newGuest = request.NewGuest.Adapt<Guest>();
                    await _guestService.CreateGuest(newGuest, cancellationToken);
                    
                    _logger.LogInformation("Dodano gościa o ID {GuestId}", newGuest.GuestId);
                    
                    request.GuestId = newGuest.GuestId;
                    
                }
                else throw new ValidationException("Guest","Do złożenia rezerwacji wymagane są dane gościa.");

                var room = await _roomProvider.GetRoomByIdAsync(request.RoomId,true, cancellationToken);
                if (room == null) throw new NotFoundException("Room", request.RoomId);
                
                var nights = (int)Math.Ceiling((request.CheckOutDate - request.CheckInDate).TotalDays);
                var totalPrice = room.RoomType.BasePrice * nights;

                var reservation = request.Adapt<Reservation>();
                reservation.GuestId = request.GuestId.Value;

                foreach (var additionalOfferDTO in request.AdditionalOffers)
                {
                    var additionalOffer = additionalOffers[additionalOfferDTO.AdditionalOfferId];

                    var reservationAdditionalOffer = additionalOfferDTO.Adapt<ReservationAdditionalOffer>();

                    reservationAdditionalOffer.OfferPrice = additionalOffer.Price;

                    totalPrice += reservationAdditionalOffer.OfferPrice * reservationAdditionalOffer.Quantity;

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
    }
}


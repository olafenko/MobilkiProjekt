using HotelManageSys.API.Exceptions;
using HotelManageSys.API.Features.Guests.Messages.Commands;
using HotelManageSys.API.Features.Guests.Providers;
using HotelManageSys.API.Features.Guests.Services;
using Mapster;
using MediatR;

namespace HotelManageSys.API.Features.Guests.Handlers.Commands
{
    public class UpdateGuestHandler : IRequestHandler<UpdateGuestCommand, Unit>
    {
        private readonly IGuestService _guestService;
        private readonly ILogger<UpdateGuestHandler> _logger;
        private readonly IGuestProvider _guestProvider;

        public UpdateGuestHandler(IGuestService guestService, ILogger<UpdateGuestHandler> logger, IGuestProvider guestProvider)
        {
            _guestService = guestService;
            _logger = logger;
            _guestProvider = guestProvider;
        }

        public async Task<Unit> Handle(UpdateGuestCommand request, CancellationToken cancellationToken)
        {
            var guest = await _guestProvider.GetGuestByIdAsync(request.GuestId, false, cancellationToken);

            if (guest == null) throw new NotFoundException("Guest", request.GuestId);

            _logger.LogInformation("Aktualizowanie gościa ID: {GuestId}", request.GuestId);

            if (await _guestProvider.GuestExistsByEmail(request.Email,request.GuestId,cancellationToken))
                throw new UniqueConstraintException("Email",$"Email {request.Email} jest już przypisany do innego gościa.");
            
            if (await _guestProvider.GuestExistsByPhoneNumber(request.PhoneNumber,request.GuestId,cancellationToken))
                throw new UniqueConstraintException("PhoneNumber",$"Numer telefonu {request.PhoneNumber} jest już przypisany do innego gościa.");
            
            if (await _guestProvider.GuestExistsByIdentityCardNumber(request.IdentityCardNumber,request.GuestId,cancellationToken))
                throw new UniqueConstraintException("IdentityCardNumber",$"Numer dokumentu tożsamości {request.IdentityCardNumber} jest już przypisany do innego gościa.");
            
            request.Adapt(guest);

            await _guestService.UpdateGuest(guest, cancellationToken);

            _logger.LogInformation("Zaaktualizowano gościa ID: {GuestId}", request.GuestId);

            return Unit.Value;
        }
    }
}


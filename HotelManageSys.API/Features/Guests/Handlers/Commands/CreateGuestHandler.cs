using HotelManageSys.API.Exceptions;
using HotelManageSys.API.Features.Guests.Messages.Commands;
using HotelManageSys.API.Features.Guests.Providers;
using HotelManageSys.API.Features.Guests.Services;
using HotelManageSys.API.Models;
using Mapster;
using MediatR;

namespace HotelManageSys.API.Features.Guests.Handlers.Commands
{
    public class CreateGuestHandler : IRequestHandler<CreateGuestCommand, int>
    {
        private readonly IGuestService _guestService;
        private readonly IGuestProvider _guestProvider;
        private readonly ILogger<CreateGuestHandler> _logger;

        public CreateGuestHandler(IGuestService guestService, IGuestProvider guestProvider, ILogger<CreateGuestHandler> logger)
        {
            _guestService = guestService;
            _guestProvider = guestProvider;
            _logger = logger;
        }

        public async Task<int> Handle(CreateGuestCommand request, CancellationToken cancellationToken)
        {
            if (await _guestProvider.GuestExistsByEmail(request.Email,cancellationToken))
                throw new UniqueConstraintException("Email",$"Email {request.Email} jest już przypisany do innego gościa.");
            
            if (await _guestProvider.GuestExistsByPhoneNumber(request.PhoneNumber,cancellationToken))
                throw new UniqueConstraintException("PhoneNumber",$"Numer telefonu {request.PhoneNumber} jest już przypisany do innego gościa.");
            
            if (await _guestProvider.GuestExistsByIdentityCardNumber(request.IdentityCardNumber,cancellationToken))
                throw new UniqueConstraintException("IdentityCardNumber",$"Numer dokumentu tożsamości {request.IdentityCardNumber} jest już przypisany do innego gościa.");
            
            _logger.LogInformation("Dodawanie nowego gościa: {FirstName} {LastName}", request.FirstName, request.LastName);

            var guest = request.Adapt<Guest>();

            await _guestService.CreateGuest(guest, cancellationToken);

            _logger.LogInformation("Dodano gościa ID: {GuestId}", guest.GuestId);

            return guest.GuestId;
        }
    }
}


using HotelManageSys.API.Features.Guests.Messages.Commands;
using HotelManageSys.API.Features.Guests.Services;
using HotelManageSys.API.Models;
using Mapster;
using MediatR;

namespace HotelManageSys.API.Features.Guests.Handlers.Commands
{
    public class CreateGuestHandler : IRequestHandler<CreateGuestCommand, int>
    {
        private readonly IGuestService _guestService;
        private readonly ILogger<CreateGuestHandler> _logger;

        public CreateGuestHandler(IGuestService guestService, ILogger<CreateGuestHandler> logger)
        {
            _guestService = guestService;
            _logger = logger;
        }

        public async Task<int> Handle(CreateGuestCommand request, CancellationToken cancellationToken)
        {
            _logger.LogInformation("Dodawanie nowego gościa: {FirstName} {LastName}", request.FirstName, request.LastName);

            var guest = request.Adapt<Guest>();

            await _guestService.CreateGuest(guest, cancellationToken);

            _logger.LogInformation("Dodano gościa ID: {GuestId}", guest.GuestId);

            return guest.GuestId;
        }
    }
}


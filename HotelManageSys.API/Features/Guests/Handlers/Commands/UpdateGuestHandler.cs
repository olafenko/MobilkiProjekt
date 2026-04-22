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

            _logger.LogInformation("Aktualizowanie gościa ID: {GuestId}", request.GuestId);

            request.Adapt(guest);

            await _guestService.UpdateGuest(guest, cancellationToken);

            _logger.LogInformation("Zaaktualizowano gościa ID: {GuestId}", request.GuestId);

            return Unit.Value;
        }
    }
}


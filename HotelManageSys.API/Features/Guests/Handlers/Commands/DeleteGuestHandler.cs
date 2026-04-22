using HotelManageSys.API.Features.Guests.Messages.Commands;
using HotelManageSys.API.Features.Guests.Providers;
using HotelManageSys.API.Features.Guests.Services;
using MediatR;

namespace HotelManageSys.API.Features.Guests.Handlers.Commands
{
    public class DeleteGuestHandler : IRequestHandler<DeleteGuestCommand, Unit>
    {
        private readonly IGuestService _guestService;
        private readonly ILogger<DeleteGuestHandler> _logger;
        private readonly IGuestProvider _guestProvider;

        public DeleteGuestHandler(IGuestService guestService, ILogger<DeleteGuestHandler> logger, IGuestProvider guestProvider)
        {
            _guestService = guestService;
            _logger = logger;
            _guestProvider = guestProvider;
        }

        public async Task<Unit> Handle(DeleteGuestCommand request, CancellationToken cancellationToken)
        {
            var guest = await _guestProvider.GetGuestByIdAsync(request.Id, false, cancellationToken);

            _logger.LogInformation("Usuwanie gościa ID: {GuestId}", request.Id);

            await _guestService.DeleteGuest(guest, cancellationToken);

            _logger.LogInformation("Usunięto gościa ID: {GuestId}", request.Id);

            return Unit.Value;
        }
    }
}


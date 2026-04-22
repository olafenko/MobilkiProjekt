using HotelManageSys.API.Features.Guests.DTO_s;
using HotelManageSys.API.Features.Guests.Messages.Queries;
using HotelManageSys.API.Features.Guests.Providers;
using Mapster;
using MediatR;

namespace HotelManageSys.API.Features.Guests.Handlers.Queries
{
    public class GetGuestByIdHandler : IRequestHandler<GetGuestByIdQuery, GuestDTO?>
    {
        private readonly IGuestProvider _guestProvider;

        public GetGuestByIdHandler(IGuestProvider guestProvider)
        {
            _guestProvider = guestProvider;
        }

        public async Task<GuestDTO?> Handle(GetGuestByIdQuery request, CancellationToken cancellationToken)
        {
            return (await _guestProvider.GetGuestByIdAsync(request.Id, true, cancellationToken))?.Adapt<GuestDTO>();
        }
    }
}


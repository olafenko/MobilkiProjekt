using HotelManageSys.API.Features.Guests.DTO_s;
using HotelManageSys.API.Features.Guests.Messages.Queries;
using HotelManageSys.API.Features.Guests.Providers;
using Mapster;
using MediatR;

namespace HotelManageSys.API.Features.Guests.Handlers.Queries
{
    public class GetAllGuestsHandler : IRequestHandler<GetAllGuestsQuery, IEnumerable<GuestDTO>>
    {
        private readonly IGuestProvider _guestProvider;

        public GetAllGuestsHandler(IGuestProvider guestProvider)
        {
            _guestProvider = guestProvider;
        }

        public async Task<IEnumerable<GuestDTO>> Handle(GetAllGuestsQuery request, CancellationToken cancellationToken)
        {
            return (await _guestProvider.GetAllGuestsAsync(cancellationToken)).Adapt<IEnumerable<GuestDTO>>();
        }
    }
}


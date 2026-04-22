using HotelManageSys.API.Features.Guests.DTO_s;
using MediatR;

namespace HotelManageSys.API.Features.Guests.Messages.Queries
{
    public class GetAllGuestsQuery : IRequest<IEnumerable<GuestDTO>>
    {
    }
}


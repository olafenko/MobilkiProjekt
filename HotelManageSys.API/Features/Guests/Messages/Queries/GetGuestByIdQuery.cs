using HotelManageSys.API.Features.Guests.DTO_s;
using MediatR;

namespace HotelManageSys.API.Features.Guests.Messages.Queries
{
    public class GetGuestByIdQuery : IRequest<GuestDTO>
    {
        public int Id { get; set; }

        public GetGuestByIdQuery(int id)
        {
            Id = id;
        }
    }
}


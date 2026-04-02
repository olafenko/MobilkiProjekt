using MediatR;

namespace HotelManageSys.API.Features.Rooms.Messages.Queries
{
    public class GetAllRoomsQuery : IRequest<IEnumerable<RoomDTO>>
    {
    }
}

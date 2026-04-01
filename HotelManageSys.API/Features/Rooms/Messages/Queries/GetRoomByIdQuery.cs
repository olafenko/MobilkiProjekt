using MediatR;

namespace HotelManageSys.API.Features.Rooms.Messages.Queries
{
    public class GetRoomByIdQuery : IRequest<RoomDTO>
    {
    }
}

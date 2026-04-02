using HotelManageSys.API.Features.Rooms.Messages.Queries;
using HotelManageSys.API.Features.Rooms.Providers;
using Mapster;
using MediatR;

namespace HotelManageSys.API.Features.Rooms.Handlers.Queries
{
    public class GetAllRoomsHandler : IRequestHandler<GetAllRoomsQuery, IEnumerable<RoomDTO>>
    {

        private readonly IRoomProvider _roomProvider;

        public GetAllRoomsHandler(IRoomProvider roomProvider)
        {
            _roomProvider = roomProvider;
        }

        public async Task<IEnumerable<RoomDTO>> Handle(GetAllRoomsQuery request, CancellationToken cancellationToken)
        {

            return ( await _roomProvider.GetAllRoomsAsync(cancellationToken) ).Adapt<IEnumerable<RoomDTO>>();

        }
    }
}

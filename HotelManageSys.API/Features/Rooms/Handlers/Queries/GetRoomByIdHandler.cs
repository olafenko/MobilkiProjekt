using HotelManageSys.API.Features.Rooms.Messages.Queries;
using HotelManageSys.API.Features.Rooms.Providers;
using Mapster;
using MediatR;

namespace HotelManageSys.API.Features.Rooms.Handlers.Queries
{
    public class GetRoomByIdHandler : IRequestHandler<GetRoomByIdQuery, RoomDTO?>
    {

        private readonly IRoomProvider _roomProvider;

        public GetRoomByIdHandler(IRoomProvider roomProvider)
        {
            _roomProvider = roomProvider;
        }

    public async Task<RoomDTO?> Handle(GetRoomByIdQuery request, CancellationToken cancellationToken)
    {

        return (await _roomProvider.GetRoomByIdAsync(request.Id, cancellationToken))?.Adapt<RoomDTO>();

    }
}
}

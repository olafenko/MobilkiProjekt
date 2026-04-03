using HotelManageSys.API.Features.Rooms.Messages.Commands;
using HotelManageSys.API.Features.Rooms.Providers;
using HotelManageSys.API.Features.Rooms.Services;
using MediatR;

namespace HotelManageSys.API.Features.Rooms.Handlers.Commands
{
    public class DeleteRoomHandler : IRequestHandler<DeleteRoomCommand, Unit>
    {

        private readonly IRoomService _roomService;
        private readonly ILogger<DeleteRoomHandler> _logger;
        private readonly IRoomProvider _roomProvider;

        public DeleteRoomHandler(IRoomService roomService, ILogger<DeleteRoomHandler> logger, IRoomProvider roomProvider)
        {
            _roomService = roomService;
            _logger = logger;
            _roomProvider = roomProvider;
        }


        public async Task<Unit> Handle(DeleteRoomCommand request, CancellationToken cancellationToken)
        {

            var room = await _roomProvider.GetRoomByIdAsync(request.Id,false, cancellationToken);

            _logger.LogInformation("Usuwanie pokoju ID: {RoomId}", request.Id);

            await _roomService.DeleteRoom(room, cancellationToken);

            _logger.LogInformation("Usunięto pokoju ID: {RoomId}", request.Id);

            return Unit.Value;

        }
    }
}

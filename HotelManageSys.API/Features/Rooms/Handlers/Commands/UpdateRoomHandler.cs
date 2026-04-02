using HotelManageSys.API.Features.Rooms.Messages.Commands;
using HotelManageSys.API.Features.Rooms.Providers;
using HotelManageSys.API.Features.Rooms.Services;
using Mapster;
using MediatR;

namespace HotelManageSys.API.Features.Rooms.Handlers.Commands
{
    public class UpdateRoomHandler : IRequestHandler<UpdateRoomCommand, Unit>
    {

        private readonly IRoomService _roomService;
        private readonly ILogger<UpdateRoomHandler> _logger;
        private readonly IRoomProvider _roomProvider;

        public UpdateRoomHandler(IRoomService roomService, ILogger<UpdateRoomHandler> logger, IRoomProvider roomProvider)
        {
            _roomService = roomService;
            _logger = logger;
            _roomProvider = roomProvider;
        }

        public async Task<Unit> Handle(UpdateRoomCommand request, CancellationToken cancellationToken)
        {

            var room = await _roomProvider.GetRoomByIdAsync(request.RoomId,false, cancellationToken);

            if (room == null)
            {
                throw new KeyNotFoundException($"Nie znaleziono pokoju z ID {request.RoomId}");

            }

            _logger.LogInformation("Aktualizowanie pokoju ID: {RoomId}", request.RoomId);

            request.Adapt(room);

            await _roomService.UpdateRoom(room, cancellationToken);

            _logger.LogInformation("Zaaktualizowano pokój ID: {RoomId}", request.RoomId);

            return Unit.Value;


        }
    }
}

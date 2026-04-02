using HotelManageSys.API.Features.Rooms.Messages.Commands;
using HotelManageSys.API.Features.Rooms.Services;
using HotelManageSys.API.Models;
using Mapster;
using MediatR;

namespace HotelManageSys.API.Features.Rooms.Handlers.Commands
{
    public class CreateRoomHandler : IRequestHandler<CreateRoomCommand, int>
    {

        private readonly IRoomService _roomService;
        private readonly ILogger<CreateRoomHandler> _logger;

        public CreateRoomHandler(IRoomService roomService, ILogger<CreateRoomHandler> logger)
        {
            _roomService = roomService;
            _logger = logger;
        }

        public async Task<int> Handle(CreateRoomCommand request, CancellationToken cancellationToken)
        {

            _logger.LogInformation("Dodawanie nowego pokoju: {Number}", request.Number);

            var room = request.Adapt<Room>();

            await _roomService.CreateRoom(room, cancellationToken);

            _logger.LogInformation("Dodano pokój ID: {RoomId}", room.RoomId);

            return room.RoomId;
        }
    }


}

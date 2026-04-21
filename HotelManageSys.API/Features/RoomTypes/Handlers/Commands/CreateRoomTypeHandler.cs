using HotelManageSys.API.Features.RoomTypes.Messages.Commands;
using HotelManageSys.API.Features.RoomTypes.Services;
using HotelManageSys.API.Models;
using Mapster;
using MediatR;

namespace HotelManageSys.API.Features.RoomTypes.Handlers.Commands
{
    public class CreateRoomTypeHandler : IRequestHandler<CreateRoomTypeCommand, int>
    {
        private readonly IRoomTypeService _roomTypeService;
        private readonly ILogger<CreateRoomTypeHandler> _logger;

        public CreateRoomTypeHandler(IRoomTypeService roomTypeService, ILogger<CreateRoomTypeHandler> logger)
        {
            _roomTypeService = roomTypeService;
            _logger = logger;
        }

        public async Task<int> Handle(CreateRoomTypeCommand request, CancellationToken cancellationToken)
        {
            _logger.LogInformation("Dodawanie nowego typu pokoju: {Name}", request.Name);

            var roomType = request.Adapt<RoomType>();

            await _roomTypeService.CreateRoomType(roomType, cancellationToken);

            _logger.LogInformation("Dodano typ pokoju ID: {RoomTypeId}", roomType.RoomTypeId);

            return roomType.RoomTypeId;
        }
    }
}

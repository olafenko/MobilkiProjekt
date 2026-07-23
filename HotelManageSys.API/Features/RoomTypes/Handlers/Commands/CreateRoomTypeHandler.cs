using HotelManageSys.API.Exceptions;
using HotelManageSys.API.Features.RoomTypes.Messages.Commands;
using HotelManageSys.API.Features.RoomTypes.Providers;
using HotelManageSys.API.Features.RoomTypes.Services;
using HotelManageSys.API.Models;
using Mapster;
using MediatR;

namespace HotelManageSys.API.Features.RoomTypes.Handlers.Commands
{
    public class CreateRoomTypeHandler : IRequestHandler<CreateRoomTypeCommand, int>
    {
        private readonly IRoomTypeService _roomTypeService;
        private readonly IRoomTypeProvider _roomTypeProvider;
        private readonly ILogger<CreateRoomTypeHandler> _logger;

        public CreateRoomTypeHandler(IRoomTypeService roomTypeService, IRoomTypeProvider roomTypeProvider, ILogger<CreateRoomTypeHandler> logger)
        {
            _roomTypeService = roomTypeService;
            _roomTypeProvider = roomTypeProvider;
            _logger = logger;
        }

        public async Task<int> Handle(CreateRoomTypeCommand request, CancellationToken cancellationToken)
        {
            _logger.LogInformation("Dodawanie nowego typu pokoju: {Name}", request.Name);

            if (await _roomTypeProvider.RoomTypeExistsByName(request.Name, cancellationToken))
            {
                throw new ValidationException("Name",$"Typ pokoju o nazwie {request.Name} już istnieje");
            }
            
            var roomType = request.Adapt<RoomType>();

            await _roomTypeService.CreateRoomType(roomType, cancellationToken);

            _logger.LogInformation("Dodano typ pokoju ID: {RoomTypeId}", roomType.RoomTypeId);

            return roomType.RoomTypeId;
        }
    }
}

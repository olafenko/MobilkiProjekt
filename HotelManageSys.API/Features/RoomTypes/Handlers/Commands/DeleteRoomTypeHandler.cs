using HotelManageSys.API.Features.RoomTypes.Messages.Commands;
using HotelManageSys.API.Features.RoomTypes.Providers;
using HotelManageSys.API.Features.RoomTypes.Services;
using MediatR;

namespace HotelManageSys.API.Features.RoomTypes.Handlers.Commands
{
    public class DeleteRoomTypeHandler : IRequestHandler<DeleteRoomTypeCommand, Unit>
    {
        private readonly IRoomTypeService _roomTypeService;
        private readonly ILogger<DeleteRoomTypeHandler> _logger;
        private readonly IRoomTypeProvider _roomTypeProvider;

        public DeleteRoomTypeHandler(IRoomTypeService roomTypeService, ILogger<DeleteRoomTypeHandler> logger, IRoomTypeProvider roomTypeProvider)
        {
            _roomTypeService = roomTypeService;
            _logger = logger;
            _roomTypeProvider = roomTypeProvider;
        }

        public async Task<Unit> Handle(DeleteRoomTypeCommand request, CancellationToken cancellationToken)
        {
            var roomType = await _roomTypeProvider.GetRoomTypeByIdAsync(request.Id, false, cancellationToken);

            _logger.LogInformation("Usuwanie typu pokoju ID: {RoomTypeId}", request.Id);

            await _roomTypeService.DeleteRoomType(roomType, cancellationToken);

            _logger.LogInformation("Usunięto typ pokoju ID: {RoomTypeId}", request.Id);

            return Unit.Value;
        }
    }
}

using HotelManageSys.API.Features.RoomTypes.Messages.Commands;
using HotelManageSys.API.Features.RoomTypes.Providers;
using HotelManageSys.API.Features.RoomTypes.Services;
using Mapster;
using MediatR;

namespace HotelManageSys.API.Features.RoomTypes.Handlers.Commands
{
    public class UpdateRoomTypeHandler : IRequestHandler<UpdateRoomTypeCommand, Unit>
    {
        private readonly IRoomTypeService _roomTypeService;
        private readonly ILogger<UpdateRoomTypeHandler> _logger;
        private readonly IRoomTypeProvider _roomTypeProvider;

        public UpdateRoomTypeHandler(IRoomTypeService roomTypeService, ILogger<UpdateRoomTypeHandler> logger, IRoomTypeProvider roomTypeProvider)
        {
            _roomTypeService = roomTypeService;
            _logger = logger;
            _roomTypeProvider = roomTypeProvider;
        }

        public async Task<Unit> Handle(UpdateRoomTypeCommand request, CancellationToken cancellationToken)
        {
            var roomType = await _roomTypeProvider.GetRoomTypeByIdAsync(request.RoomTypeId, false, cancellationToken);

            _logger.LogInformation("Aktualizowanie typu pokoju ID: {RoomTypeId}", request.RoomTypeId);

            request.Adapt(roomType);

            await _roomTypeService.UpdateRoomType(roomType, cancellationToken);

            _logger.LogInformation("Zaaktualizowano typ pokoju ID: {RoomTypeId}", request.RoomTypeId);

            return Unit.Value;
        }
    }
}

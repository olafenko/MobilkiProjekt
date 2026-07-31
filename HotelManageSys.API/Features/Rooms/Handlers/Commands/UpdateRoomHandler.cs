using HotelManageSys.API.Exceptions;
using HotelManageSys.API.Features.Amenities.Providers;
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
        private readonly IAmenityProvider _amenityProvider;
        private readonly ILogger<UpdateRoomHandler> _logger;
        private readonly IRoomProvider _roomProvider;

        public UpdateRoomHandler(IRoomService roomService, ILogger<UpdateRoomHandler> logger, IRoomProvider roomProvider, IAmenityProvider amenityProvider)
        {
            _roomService = roomService;
            _logger = logger;
            _roomProvider = roomProvider;
            _amenityProvider = amenityProvider;
        }

        public async Task<Unit> Handle(UpdateRoomCommand request, CancellationToken cancellationToken)
        {

            var room = await _roomProvider.GetRoomByIdAsync(request.RoomId,false, cancellationToken);
            
            if (room == null) throw new NotFoundException("Room", request.RoomId);

            if (await _roomProvider.RoomExistsByNumber(request.Number, request.RoomId, cancellationToken))
                throw new UniqueConstraintException("Number",$"Pokój o numerze {request.Number} już istnieje");

            _logger.LogInformation("Aktualizowanie pokoju ID: {RoomId}", request.RoomId);

            request.Adapt(room);
            
            var newAmenities = await _amenityProvider.GetAmenitiesByIdsAsync(request.AmenitiesIds,false,cancellationToken);

            room.Amenities = newAmenities;
            
            await _roomService.UpdateRoom(room, cancellationToken);

            _logger.LogInformation("Zaaktualizowano pokój ID: {RoomId}", request.RoomId);

            return Unit.Value;


        }
    }
}

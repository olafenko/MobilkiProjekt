using HotelManageSys.API.Features.Rooms.Messages.Commands;
using HotelManageSys.API.Features.Rooms.Services;
using HotelManageSys.API.Models;
using HotelManageSys.API.Features.Amenities.Providers;
using Mapster;
using MediatR;

namespace HotelManageSys.API.Features.Rooms.Handlers.Commands
{
    public class CreateRoomHandler : IRequestHandler<CreateRoomCommand, int>
    {

        private readonly IRoomService _roomService;
        private readonly IAmenityProvider _amenityProvider;
        private readonly ILogger<CreateRoomHandler> _logger;

        public CreateRoomHandler(IRoomService roomService, IAmenityProvider amenityProvider, ILogger<CreateRoomHandler> logger)
        {
            _roomService = roomService;
            _amenityProvider = amenityProvider;
            _logger = logger;
        }

        public async Task<int> Handle(CreateRoomCommand request, CancellationToken cancellationToken)
        {

            _logger.LogInformation("Dodawanie nowego pokoju: {Number}", request.Number);

            var room = request.Adapt<Room>();

            if (request.AmenitiesIds.Count > 0)
            {
                var amenities = await _amenityProvider.GetAmenitiesByIdsAsync(request.AmenitiesIds, false, cancellationToken);

                room.Amenities = amenities;
            }

            await _roomService.CreateRoom(room, cancellationToken);

            _logger.LogInformation("Dodano pokój ID: {RoomId}", room.RoomId);

            return room.RoomId;
        }
    }


}

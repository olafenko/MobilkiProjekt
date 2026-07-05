using HotelManageSys.API.Exceptions;
using HotelManageSys.API.Features.Rooms.Messages.Commands;
using HotelManageSys.API.Features.Rooms.Services;
using HotelManageSys.API.Models;
using HotelManageSys.API.Features.Amenities.Providers;
using HotelManageSys.API.Features.Rooms.Providers;
using Mapster;
using MediatR;

namespace HotelManageSys.API.Features.Rooms.Handlers.Commands
{
    public class CreateRoomHandler : IRequestHandler<CreateRoomCommand, int>
    {

        private readonly IRoomService _roomService;
        private readonly IRoomProvider _roomProvider;
        private readonly IAmenityProvider _amenityProvider;
        private readonly ILogger<CreateRoomHandler> _logger;

        public CreateRoomHandler(IRoomService roomService, IRoomProvider roomProvider, IAmenityProvider amenityProvider, ILogger<CreateRoomHandler> logger)
        {
            _roomService = roomService;
            _roomProvider = roomProvider;
            _amenityProvider = amenityProvider;
            _logger = logger;
        }

        public async Task<int> Handle(CreateRoomCommand request, CancellationToken cancellationToken)
        {

            _logger.LogInformation("Dodawanie nowego pokoju: {Number}", request.Number);

            if (await _roomProvider.RoomExistsByNumber(request.Number, cancellationToken))
            {
                throw new ValidationException("Number",$"Pokój o numerze {request.Number} już istnieje");
            }
            
            var room = request.Adapt<Room>();

            if (request.AmenitiesIds.Any())
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

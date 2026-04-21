using HotelManageSys.API.Features.RoomTypes.DTO_s;
using HotelManageSys.API.Features.RoomTypes.Messages.Queries;
using HotelManageSys.API.Features.RoomTypes.Providers;
using Mapster;
using MediatR;

namespace HotelManageSys.API.Features.RoomTypes.Handlers.Queries
{
    public class GetRoomTypeByIdHandler : IRequestHandler<GetRoomTypeByIdQuery, RoomTypeDTO?>
    {
        private readonly IRoomTypeProvider _roomTypeProvider;

        public GetRoomTypeByIdHandler(IRoomTypeProvider roomTypeProvider)
        {
            _roomTypeProvider = roomTypeProvider;
        }

        public async Task<RoomTypeDTO?> Handle(GetRoomTypeByIdQuery request, CancellationToken cancellationToken)
        {
            return (await _roomTypeProvider.GetRoomTypeByIdAsync(request.Id, true, cancellationToken))?.Adapt<RoomTypeDTO>();
        }
    }
}

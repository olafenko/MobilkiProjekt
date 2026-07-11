using HotelManageSys.API.Exceptions;
using HotelManageSys.API.Features.RoomTypes.DTO_s;
using HotelManageSys.API.Features.RoomTypes.Messages.Queries;
using HotelManageSys.API.Features.RoomTypes.Providers;
using Mapster;
using MediatR;

namespace HotelManageSys.API.Features.RoomTypes.Handlers.Queries
{
    public class GetRoomTypeByIdHandler : IRequestHandler<GetRoomTypeByIdQuery, RoomTypeDTO>
    {
        private readonly IRoomTypeProvider _roomTypeProvider;

        public GetRoomTypeByIdHandler(IRoomTypeProvider roomTypeProvider)
        {
            _roomTypeProvider = roomTypeProvider;
        }

        public async Task<RoomTypeDTO> Handle(GetRoomTypeByIdQuery request, CancellationToken cancellationToken)
        {

            var roomType = await _roomTypeProvider.GetRoomTypeById(request.Id, true, cancellationToken);
            
            if (roomType == null) throw new NotFoundException("RoomType", request.Id);
            
            return roomType.Adapt<RoomTypeDTO>();
        }
    }
}

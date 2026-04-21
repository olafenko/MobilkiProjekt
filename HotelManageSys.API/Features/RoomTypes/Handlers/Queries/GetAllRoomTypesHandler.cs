using HotelManageSys.API.Features.RoomTypes.DTO_s;
using HotelManageSys.API.Features.RoomTypes.Messages.Queries;
using HotelManageSys.API.Features.RoomTypes.Providers;
using Mapster;
using MediatR;

namespace HotelManageSys.API.Features.RoomTypes.Handlers.Queries
{
    public class GetAllRoomTypesHandler : IRequestHandler<GetAllRoomTypesQuery, IEnumerable<RoomTypeDTO>>
    {
        private readonly IRoomTypeProvider _roomTypeProvider;

        public GetAllRoomTypesHandler(IRoomTypeProvider provider)
        {
            _roomTypeProvider = provider;
        }

        public async Task<IEnumerable<RoomTypeDTO>> Handle(GetAllRoomTypesQuery request, CancellationToken cancellationToken)
        {

            return ( await _roomTypeProvider.GetAllRoomTypesAsync(cancellationToken) ).Adapt<IEnumerable<RoomTypeDTO>>();
        }
    }
}

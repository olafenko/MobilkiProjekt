using HotelManageSys.API.Features.RoomTypes.DTO_s;
using MediatR;

namespace HotelManageSys.API.Features.RoomTypes.Messages.Queries
{
    public class GetAllRoomTypesQuery : IRequest<IEnumerable<RoomTypeDTO>>
    {
    }
}

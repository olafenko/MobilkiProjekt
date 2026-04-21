using HotelManageSys.API.Features.RoomTypes.DTO_s;
using MediatR;

namespace HotelManageSys.API.Features.RoomTypes.Messages.Queries
{
    public class GetRoomTypeByIdQuery : IRequest<RoomTypeDTO>
    {
        public int Id { get; set; }

        public GetRoomTypeByIdQuery(int id)
        {
            Id = id;
        }
    }
}

using MediatR;

namespace HotelManageSys.API.Features.Rooms.Messages.Queries
{
    public class GetRoomByIdQuery : IRequest<RoomDTO>
    {
      
        public int Id { get; set; }

        public GetRoomByIdQuery(int id)
        {
            Id = id;
        }


    }
}

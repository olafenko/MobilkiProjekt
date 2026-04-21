using MediatR;

namespace HotelManageSys.API.Features.RoomTypes.Messages.Commands
{
    public class DeleteRoomTypeCommand : IRequest<Unit>
    {
        public int Id { get; set; }

        public DeleteRoomTypeCommand(int id)
        {
            Id = id;
        }
    }
}

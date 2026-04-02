using MediatR;

namespace HotelManageSys.API.Features.Rooms.Messages.Commands
{
    public class DeleteRoomCommand : IRequest<Unit>
    {
       
        public int Id { get; set; }

        public DeleteRoomCommand(int id)
        {
            Id = id;
        }


    }
}

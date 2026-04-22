using MediatR;

namespace HotelManageSys.API.Features.Guests.Messages.Commands
{
    public class DeleteGuestCommand : IRequest<Unit>
    {
        public int Id { get; set; }

        public DeleteGuestCommand(int id)
        {
            Id = id;
        }
    }
}


using MediatR;

namespace HotelManageSys.API.Features.Reservations.Messages.Commands
{
    public class DeleteReservationCommand : IRequest<Unit>
    {
        public int Id { get; set; }

        public DeleteReservationCommand(int id)
        {
            Id = id;
        }
    }
}


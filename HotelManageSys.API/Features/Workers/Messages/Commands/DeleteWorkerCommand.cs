using MediatR;

namespace HotelManageSys.API.Features.Workers.Messages.Commands
{
    public class DeleteWorkerCommand : IRequest<Unit>
    {
        public int Id { get; set; }

        public DeleteWorkerCommand(int id)
        {
            Id = id;
        }
    }
}


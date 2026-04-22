using MediatR;

namespace HotelManageSys.API.Features.Workers.Messages.Commands
{
    public class CreateWorkerCommand : IRequest<int>
    {
        public required string FirstName { get; set; }
        public required string LastName { get; set; }

        public required string Login { get; set; }
        public required string Password { get; set; }
    }
}


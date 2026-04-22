using MediatR;

namespace HotelManageSys.API.Features.Payments.Messages.Commands
{
    public class DeletePaymentCommand : IRequest<Unit>
    {
        public int Id { get; set; }

        public DeletePaymentCommand(int id)
        {
            Id = id;
        }
    }
}


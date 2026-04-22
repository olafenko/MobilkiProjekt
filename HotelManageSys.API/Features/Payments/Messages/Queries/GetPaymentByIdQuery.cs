using HotelManageSys.API.Features.Payments.DTO_s;
using MediatR;

namespace HotelManageSys.API.Features.Payments.Messages.Queries
{
    public class GetPaymentByIdQuery : IRequest<PaymentDTO>
    {
        public int Id { get; set; }

        public GetPaymentByIdQuery(int id)
        {
            Id = id;
        }
    }
}


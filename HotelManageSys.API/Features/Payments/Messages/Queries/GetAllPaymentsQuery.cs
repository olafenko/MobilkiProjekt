using HotelManageSys.API.Features.Payments.DTO_s;
using MediatR;

namespace HotelManageSys.API.Features.Payments.Messages.Queries
{
    public class GetAllPaymentsQuery : IRequest<IEnumerable<PaymentDTO>>
    {
    }
}


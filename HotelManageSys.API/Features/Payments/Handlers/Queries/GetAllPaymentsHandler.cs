using HotelManageSys.API.Features.Payments.DTO_s;
using HotelManageSys.API.Features.Payments.Messages.Queries;
using HotelManageSys.API.Features.Payments.Providers;
using Mapster;
using MediatR;

namespace HotelManageSys.API.Features.Payments.Handlers.Queries
{
    public class GetAllPaymentsHandler : IRequestHandler<GetAllPaymentsQuery, IEnumerable<PaymentDTO>>
    {
        private readonly IPaymentProvider _paymentProvider;

        public GetAllPaymentsHandler(IPaymentProvider paymentProvider)
        {
            _paymentProvider = paymentProvider;
        }

        public async Task<IEnumerable<PaymentDTO>> Handle(GetAllPaymentsQuery request, CancellationToken cancellationToken)
        {
            return (await _paymentProvider.GetAllPaymentsAsync(cancellationToken)).Adapt<IEnumerable<PaymentDTO>>();
        }
    }
}


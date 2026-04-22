using HotelManageSys.API.Features.Payments.DTO_s;
using HotelManageSys.API.Features.Payments.Messages.Queries;
using HotelManageSys.API.Features.Payments.Providers;
using Mapster;
using MediatR;

namespace HotelManageSys.API.Features.Payments.Handlers.Queries
{
    public class GetPaymentByIdHandler : IRequestHandler<GetPaymentByIdQuery, PaymentDTO?>
    {
        private readonly IPaymentProvider _paymentProvider;

        public GetPaymentByIdHandler(IPaymentProvider paymentProvider)
        {
            _paymentProvider = paymentProvider;
        }

        public async Task<PaymentDTO?> Handle(GetPaymentByIdQuery request, CancellationToken cancellationToken)
        {
            return (await _paymentProvider.GetPaymentByIdAsync(request.Id, true, cancellationToken))?.Adapt<PaymentDTO>();
        }
    }
}


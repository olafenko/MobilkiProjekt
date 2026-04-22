using HotelManageSys.API.Features.Payments.Messages.Commands;
using HotelManageSys.API.Features.Payments.Providers;
using HotelManageSys.API.Features.Payments.Services;
using Mapster;
using MediatR;

namespace HotelManageSys.API.Features.Payments.Handlers.Commands
{
    public class UpdatePaymentHandler : IRequestHandler<UpdatePaymentCommand, Unit>
    {
        private readonly IPaymentService _paymentService;
        private readonly ILogger<UpdatePaymentHandler> _logger;
        private readonly IPaymentProvider _paymentProvider;

        public UpdatePaymentHandler(IPaymentService paymentService, ILogger<UpdatePaymentHandler> logger, IPaymentProvider paymentProvider)
        {
            _paymentService = paymentService;
            _logger = logger;
            _paymentProvider = paymentProvider;
        }

        public async Task<Unit> Handle(UpdatePaymentCommand request, CancellationToken cancellationToken)
        {
            var payment = await _paymentProvider.GetPaymentByIdAsync(request.PaymentId, false, cancellationToken);

            _logger.LogInformation("Aktualizowanie płatności ID: {PaymentId}", request.PaymentId);

            request.Adapt(payment);

            await _paymentService.UpdatePayment(payment, cancellationToken);

            _logger.LogInformation("Zaaktualizowano płatność ID: {PaymentId}", request.PaymentId);

            return Unit.Value;
        }
    }
}


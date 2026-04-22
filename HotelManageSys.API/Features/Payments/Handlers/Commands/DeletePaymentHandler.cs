using HotelManageSys.API.Features.Payments.Messages.Commands;
using HotelManageSys.API.Features.Payments.Providers;
using HotelManageSys.API.Features.Payments.Services;
using MediatR;

namespace HotelManageSys.API.Features.Payments.Handlers.Commands
{
    public class DeletePaymentHandler : IRequestHandler<DeletePaymentCommand, Unit>
    {
        private readonly IPaymentService _paymentService;
        private readonly ILogger<DeletePaymentHandler> _logger;
        private readonly IPaymentProvider _paymentProvider;

        public DeletePaymentHandler(IPaymentService paymentService, ILogger<DeletePaymentHandler> logger, IPaymentProvider paymentProvider)
        {
            _paymentService = paymentService;
            _logger = logger;
            _paymentProvider = paymentProvider;
        }

        public async Task<Unit> Handle(DeletePaymentCommand request, CancellationToken cancellationToken)
        {
            var payment = await _paymentProvider.GetPaymentByIdAsync(request.Id, false, cancellationToken);

            _logger.LogInformation("Usuwanie płatności ID: {PaymentId}", request.Id);

            await _paymentService.DeletePayment(payment, cancellationToken);

            _logger.LogInformation("Usunięto płatność ID: {PaymentId}", request.Id);

            return Unit.Value;
        }
    }
}


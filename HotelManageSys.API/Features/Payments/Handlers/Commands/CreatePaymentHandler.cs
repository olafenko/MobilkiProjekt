using HotelManageSys.API.Features.Payments.Messages.Commands;
using HotelManageSys.API.Features.Payments.Services;
using HotelManageSys.API.Models;
using Mapster;
using MediatR;

namespace HotelManageSys.API.Features.Payments.Handlers.Commands
{
    public class CreatePaymentHandler : IRequestHandler<CreatePaymentCommand, int>
    {
        private readonly IPaymentService _paymentService;
        private readonly ILogger<CreatePaymentHandler> _logger;

        public CreatePaymentHandler(IPaymentService paymentService, ILogger<CreatePaymentHandler> logger)
        {
            _paymentService = paymentService;
            _logger = logger;
        }

        public async Task<int> Handle(CreatePaymentCommand request, CancellationToken cancellationToken)
        {
            _logger.LogInformation("Dodawanie nowej płatności dla rezerwacji ID: {ReservationId}", request.ReservationId);

            var payment = request.Adapt<Payment>();

            await _paymentService.CreatePayment(payment, cancellationToken);

            _logger.LogInformation("Dodano płatność ID: {PaymentId}", payment.PaymentId);

            return payment.PaymentId;
        }
    }
}


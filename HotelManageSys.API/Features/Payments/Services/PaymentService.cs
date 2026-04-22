using HotelManageSys.API.Models;
using HotelManageSys.API.Models.Data;

namespace HotelManageSys.API.Features.Payments.Services
{
    public class PaymentService : IPaymentService
    {
        private readonly ApplicationDbContext _context;

        public PaymentService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task CreatePayment(Payment payment, CancellationToken cancellationToken = default)
        {
            _context.Add(payment);
            await _context.SaveChangesAsync(cancellationToken);
        }

        public async Task UpdatePayment(Payment payment, CancellationToken cancellationToken = default)
        {
            await _context.SaveChangesAsync(cancellationToken);
        }

        public async Task DeletePayment(Payment payment, CancellationToken cancellationToken = default)
        {
            payment.IsActive = false;
            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}


using HotelManageSys.API.Models;
using HotelManageSys.API.Models.Data;
using Microsoft.EntityFrameworkCore;

namespace HotelManageSys.API.Features.Payments.Providers
{
    public class PaymentProvider : IPaymentProvider
    {
        private readonly ApplicationDbContext _dbContext;

        public PaymentProvider(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<IEnumerable<Payment>> GetAllPaymentsAsync(CancellationToken cancellationToken = default)
        {
            return await _dbContext.Payments
                .AsNoTracking()
                .Include(p => p.Reservation)
                .Where(p => p.IsActive)
                .OrderByDescending(p => p.PaymentDate)
                .ToListAsync(cancellationToken);
        }

        public async Task<Payment> GetPaymentByIdAsync(int paymentId, bool asNoTracking = true, CancellationToken cancellationToken = default)
        {
            IQueryable<Payment> query = _dbContext.Payments
                .Include(p => p.Reservation);

            if (asNoTracking)
            {
                query = query.AsNoTracking();
            }

            var payment = await query.FirstOrDefaultAsync(p => p.IsActive && p.PaymentId == paymentId, cancellationToken);

            return payment ?? throw new KeyNotFoundException($"Nie znaleziono płatności o ID {paymentId}");
        }
    }
}


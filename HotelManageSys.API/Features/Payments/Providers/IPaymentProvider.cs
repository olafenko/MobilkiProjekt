using HotelManageSys.API.Models;

namespace HotelManageSys.API.Features.Payments.Providers
{
    public interface IPaymentProvider
    {
        Task<IEnumerable<Payment>> GetAllPaymentsAsync(CancellationToken cancellationToken = default);

        Task<Payment> GetPaymentByIdAsync(int paymentId, bool asNoTracking = true, CancellationToken cancellationToken = default);
    }
}


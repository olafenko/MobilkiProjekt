using HotelManageSys.API.Models;

namespace HotelManageSys.API.Features.Payments.Services
{
    public interface IPaymentService
    {
        Task CreatePayment(Payment payment, CancellationToken cancellationToken = default);
        Task UpdatePayment(Payment payment, CancellationToken cancellationToken = default);
        Task DeletePayment(Payment payment, CancellationToken cancellationToken = default);
    }
}


using HotelManageSys.API.Models;

namespace HotelManageSys.API.Features.Workers.Services
{
    public interface IWorkerService
    {
        Task CreateWorker(Worker worker, CancellationToken cancellationToken = default);
        Task UpdateWorker(Worker worker, CancellationToken cancellationToken = default);
        Task DeleteWorker(Worker worker, CancellationToken cancellationToken = default);
    }
}


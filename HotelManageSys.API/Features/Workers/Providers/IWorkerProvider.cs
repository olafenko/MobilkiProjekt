using HotelManageSys.API.Models;

namespace HotelManageSys.API.Features.Workers.Providers
{
    public interface IWorkerProvider
    {
        Task<IEnumerable<Worker>> GetAllWorkersAsync(CancellationToken cancellationToken = default);

        Task<Worker?> GetWorkerByIdAsync(int workerId, bool asNoTracking = true, CancellationToken cancellationToken = default);
        Task<bool> WorkerExistsByLogin(string login, CancellationToken cancellationToken = default);
        Task<bool> WorkerExistsByLogin(string login, int workerId, CancellationToken cancellationToken = default);
    }
}


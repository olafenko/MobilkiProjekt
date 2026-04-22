using HotelManageSys.API.Models;
using HotelManageSys.API.Models.Data;

namespace HotelManageSys.API.Features.Workers.Services
{
    public class WorkerService : IWorkerService
    {
        private readonly ApplicationDbContext _context;

        public WorkerService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task CreateWorker(Worker worker, CancellationToken cancellationToken = default)
        {
            _context.Add(worker);
            await _context.SaveChangesAsync(cancellationToken);
        }

        public async Task UpdateWorker(Worker worker, CancellationToken cancellationToken = default)
        {
            await _context.SaveChangesAsync(cancellationToken);
        }

        public async Task DeleteWorker(Worker worker, CancellationToken cancellationToken = default)
        {
            worker.IsActive = false;
            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}


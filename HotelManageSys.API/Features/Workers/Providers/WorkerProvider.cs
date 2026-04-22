using HotelManageSys.API.Models;
using HotelManageSys.API.Models.Data;
using Microsoft.EntityFrameworkCore;

namespace HotelManageSys.API.Features.Workers.Providers
{
    public class WorkerProvider : IWorkerProvider
    {
        private readonly ApplicationDbContext _dbContext;

        public WorkerProvider(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<IEnumerable<Worker>> GetAllWorkersAsync(CancellationToken cancellationToken = default)
        {
            return await _dbContext.Workers
                .AsNoTracking()
                .Include(w => w.Reservations)
                .Where(w => w.IsActive)
                .OrderBy(w => w.LastName)
                .ThenBy(w => w.FirstName)
                .ToListAsync(cancellationToken);
        }

        public async Task<Worker> GetWorkerByIdAsync(int workerId, bool asNoTracking = true, CancellationToken cancellationToken = default)
        {
            IQueryable<Worker> query = _dbContext.Workers
                .Include(w => w.Reservations);

            if (asNoTracking)
            {
                query = query.AsNoTracking();
            }

            var worker = await query.FirstOrDefaultAsync(w => w.IsActive && w.WorkerId == workerId, cancellationToken);

            return worker ?? throw new KeyNotFoundException($"Nie znaleziono pracownika o ID {workerId}");
        }
    }
}


using HotelManageSys.API.Models;
using HotelManageSys.API.Models.Data;
using Microsoft.EntityFrameworkCore;

namespace HotelManageSys.API.Features.RoomTypes.Providers
{
    public class RoomTypeProvider : IRoomTypeProvider
    {

        private readonly ApplicationDbContext _dbContext;

        public RoomTypeProvider(ApplicationDbContext context)
        {
            _dbContext = context;
        }

        public async Task<IEnumerable<RoomType>> GetAllRoomTypesAsync(CancellationToken cancellationToken = default)
        {
            return await _dbContext.RoomTypes
                .AsNoTracking()
                .Include(rt => rt.Rooms)
                .Where(rt => rt.IsActive)
                .OrderBy(rt => rt.Name)
                .ToListAsync(cancellationToken);
        }

        public async Task<RoomType?> GetRoomTypeById(int roomId, bool asNoTracking = true, CancellationToken cancellationToken = default)
        {
            IQueryable<RoomType> query = _dbContext.RoomTypes
                .Include(rt => rt.Rooms);

            if (asNoTracking)
            {
                query = query.AsNoTracking();
            }
            
            return await query.FirstOrDefaultAsync(rt => rt.IsActive && rt.RoomTypeId == roomId, cancellationToken);
        }

        public async Task<bool> RoomTypeExistsByName(string name, CancellationToken cancellationToken = default)
        {
            return await _dbContext.RoomTypes.AnyAsync(rt => rt.Name == name && rt.IsActive, cancellationToken);
        }
    }
}

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

        public async Task<RoomType> GetRoomTypeByIdAsync(int roomId, bool asNoTracking = true, CancellationToken cancellationToken = default)
        {
            IQueryable<RoomType> query = _dbContext.RoomTypes
                .Include(rt => rt.Rooms);

            if (asNoTracking)
            {
                query = query.AsNoTracking();
            }

            var roomType = await query.FirstOrDefaultAsync(rt => rt.IsActive && rt.RoomTypeId == roomId, cancellationToken);

            return roomType ?? throw new KeyNotFoundException($"Nie znaleziono typu pokoju o ID {roomId}");
        }
    }
}

using HotelManageSys.API.Models;
using HotelManageSys.API.Models.Data;
using Microsoft.EntityFrameworkCore;

namespace HotelManageSys.API.Features.Rooms.Providers
{
    public class RoomProvider : IRoomProvider
    {

        private readonly ApplicationDbContext _dbContext;

        public RoomProvider(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<IEnumerable<Room>> GetAllRoomsAsync(CancellationToken cancellationToken = default)
        {

            return await _dbContext.Rooms
                .AsNoTracking()
                .Include(r => r.RoomType)
                .Include(r => r.Amenities)
                .Where(r => r.IsActive)
                .OrderBy(r => r.Number)
                .ToListAsync(cancellationToken);
        }

        public async Task<Room?> GetRoomByIdAsync(int roomId,bool noTracking = true, CancellationToken cancellationToken = default)
        {
            IQueryable<Room> query = _dbContext.Rooms
                .Include(r => r.RoomType)
                .Include(r => r.Amenities);

            if (noTracking)
            {
                query = query.AsNoTracking();
            }


            return await query.FirstOrDefaultAsync(r => r.IsActive && r.RoomId == roomId, cancellationToken);
        }
    }
}

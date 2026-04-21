using HotelManageSys.API.Models;
using HotelManageSys.API.Models.Data;

namespace HotelManageSys.API.Features.RoomTypes.Services
{
    public class RoomTypeService : IRoomTypeService
    {
        private readonly ApplicationDbContext _context;

        public RoomTypeService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task CreateRoomType(RoomType roomType, CancellationToken cancellationToken = default)
        {
            _context.Add(roomType);
            await _context.SaveChangesAsync(cancellationToken);
        }

        public async Task UpdateRoomType(RoomType roomType, CancellationToken cancellationToken = default)
        {
            await _context.SaveChangesAsync(cancellationToken);
        }

        public async Task DeleteRoomType(RoomType roomType, CancellationToken cancellationToken = default)
        {
            roomType.IsActive = false;
            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}

using HotelManageSys.API.Models;
using HotelManageSys.API.Models.Data;

namespace HotelManageSys.API.Features.Rooms.Services
{
    public class RoomService : IRoomService
    {

        private readonly ApplicationDbContext _context;

        public RoomService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task CreateRoom(Room room, CancellationToken cancellationToken = default)
        {
            _context.Add(room);

            await _context.SaveChangesAsync(cancellationToken);
        }

        
        public async Task UpdateRoom(Room room, CancellationToken cancellationToken = default)
        {
            await _context.SaveChangesAsync(cancellationToken);
        }

        public async Task DeleteRoom(Room room, CancellationToken cancellationToken = default)
        {
            room.IsActive = false;
            await _context.SaveChangesAsync(cancellationToken);
        }

    }
}

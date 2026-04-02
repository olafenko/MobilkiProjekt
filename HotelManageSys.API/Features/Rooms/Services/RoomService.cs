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
    }
}

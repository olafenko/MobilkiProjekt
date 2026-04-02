using HotelManageSys.API.Models;

namespace HotelManageSys.API.Features.Rooms.Services
{
    public interface IRoomService
    {

        Task CreateRoom(Room room, CancellationToken cancellationToken = default);

    }
}

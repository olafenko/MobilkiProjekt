using HotelManageSys.API.Models;

namespace HotelManageSys.API.Features.Rooms.Providers
{
    public interface IRoomProvider
    {

        /// <summary>
        /// 
        /// </summary>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>

        Task<IEnumerable<Room>> GetAllRoomsAsync(CancellationToken cancellationToken = default);


        /// <summary>
        /// 
        /// </summary>
        /// <param name="roomId"></param>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        Task<Room?> GetRoomByIdAsync(int roomId, CancellationToken cancellationToken = default);

    }
}

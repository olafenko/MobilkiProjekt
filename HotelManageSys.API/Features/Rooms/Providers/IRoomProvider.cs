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
        ///  Returns room by id or null 
        /// </summary>
        /// <param name="roomId"> id of room looking for</param>
        /// <param name="noTracking"> declare if no tracking by EF should be enabled or not. Default value is true</param>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        Task<Room?> GetRoomByIdAsync(int roomId, bool noTracking = true, CancellationToken cancellationToken = default);

    }
}

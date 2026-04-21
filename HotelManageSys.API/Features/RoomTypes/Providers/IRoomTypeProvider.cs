using HotelManageSys.API.Models;

namespace HotelManageSys.API.Features.RoomTypes.Providers
{
    public interface IRoomTypeProvider
    {

        Task<IEnumerable<RoomType>> GetAllRoomTypesAsync(CancellationToken cancellationToken = default);

        Task<RoomType> GetRoomTypeByIdAsync(int roomId, bool asNoTracking = true, CancellationToken cancellationToken = default);

    }
}

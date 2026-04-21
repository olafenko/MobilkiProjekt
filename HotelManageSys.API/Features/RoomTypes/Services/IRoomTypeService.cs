using HotelManageSys.API.Models;

namespace HotelManageSys.API.Features.RoomTypes.Services
{
    public interface IRoomTypeService
    {
        Task CreateRoomType(RoomType roomType, CancellationToken cancellationToken = default);
        Task UpdateRoomType(RoomType roomType, CancellationToken cancellationToken = default);
        Task DeleteRoomType(RoomType roomType, CancellationToken cancellationToken = default);
    }
}

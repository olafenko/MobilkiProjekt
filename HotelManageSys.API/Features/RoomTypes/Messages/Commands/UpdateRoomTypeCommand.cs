using MediatR;

namespace HotelManageSys.API.Features.RoomTypes.Messages.Commands
{
    public class UpdateRoomTypeCommand : IRequest<Unit>
    {
        public int RoomTypeId { get; set; }
        public required string Name { get; set; }
        public decimal BasePrice { get; set; }
        public string? Description { get; set; }
        public bool IsActive { get; set; } = true;
    }
}

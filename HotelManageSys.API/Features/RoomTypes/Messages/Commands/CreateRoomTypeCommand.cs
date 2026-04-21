using MediatR;

namespace HotelManageSys.API.Features.RoomTypes.Messages.Commands
{
    public class CreateRoomTypeCommand : IRequest<int>
    {
        public required string Name { get; set; }
        public decimal BasePrice { get; set; }
        public string? Description { get; set; }
    }
}

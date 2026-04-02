using HotelManageSys.API.Models.Enums;
using MediatR;

namespace HotelManageSys.API.Features.Rooms.Messages.Commands
{
    public class CreateRoomCommand : IRequest<int>
    {

        public required string Number { get; set; }

        public int Floor { get; set; }

        public string? Description { get; set; }
        public RoomStatus Status { get; set; }

        public int RoomTypeId { get; set; }
        

    }
}

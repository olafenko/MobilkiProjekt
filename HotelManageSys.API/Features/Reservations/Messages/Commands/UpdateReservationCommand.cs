using HotelManageSys.API.Models.Enums;
using MediatR;

namespace HotelManageSys.API.Features.Reservations.Messages.Commands
{
    public class UpdateReservationCommand : IRequest<Unit>
    {
        public int ReservationId { get; set; }

        public decimal TotalPrice { get; set; }

        public DateTime ReservationDate { get; set; }

        public DateTime CheckInDate { get; set; }
        public DateTime CheckOutDate { get; set; }

        public ReservationStatus ReservationStatus { get; set; }

        public int GuestId { get; set; }
        public int RoomId { get; set; }
        public int WorkerId { get; set; }
    }
}


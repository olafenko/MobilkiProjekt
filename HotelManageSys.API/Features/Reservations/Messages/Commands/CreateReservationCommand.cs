using HotelManageSys.API.Features.Guests.Messages.Commands;
using HotelManageSys.API.Features.ReservationAdditionalOffers.DTO_s;
using HotelManageSys.API.Models;
using HotelManageSys.API.Models.Enums;
using MediatR;

namespace HotelManageSys.API.Features.Reservations.Messages.Commands
{
    public class CreateReservationCommand : IRequest<int>
    {
        public DateTime ReservationDate { get; set; } = DateTime.Now;
        public DateTime CheckInDate { get; set; }
        public DateTime CheckOutDate { get; set; }
        public ReservationStatus ReservationStatus { get; set; }
        public string? Notes { get; set; }
        public int? GuestId { get; set; }
        public CreateGuestCommand? NewGuest{ get; set; }
        public int RoomId { get; set; }
        public int WorkerId { get; set; }
        public List<CreateReservationAdditionalOfferDTO> AdditionalOffers { get; set; } = new List<CreateReservationAdditionalOfferDTO>();
    }
}


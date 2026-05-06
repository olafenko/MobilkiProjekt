using HotelManageSys.API.Features.ReservationAdditionalOffers;
using HotelManageSys.API.Models.Enums;

namespace HotelManageSys.API.Features.Reservations.DTO_s
{
    public class ReservationDTO
    {
        public int ReservationId { get; set; }

        public decimal TotalPrice { get; set; }

        public DateTime ReservationDate { get; set; }

        public DateTime CheckInDate { get; set; }
        public DateTime CheckOutDate { get; set; }
        public int NightCount { get; set; }
        public string? Notes{ get; set; }

        public decimal AmountPaid{ get; set; }
        public decimal AmountRemaining{ get; set; }

        public string? ReservationStatus { get; set; }

        public int GuestId { get; set; }
        public string? GuestFullName { get; set; }

        public int RoomId { get; set; }
        public string? RoomNumber { get; set; }
        public string? RoomTypeName{ get; set; }

        public int WorkerId { get; set; }
        public string? WorkerFullName { get; set; }

        public List<ReservationAdditionalOfferDTO> AdditionalOffers { get; set; } = new List<ReservationAdditionalOfferDTO>();

        public bool IsActive { get; set; } = true;
    }
}


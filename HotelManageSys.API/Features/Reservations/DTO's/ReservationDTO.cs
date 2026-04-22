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

        public string? ReservationStatus { get; set; }

        public int GuestId { get; set; }
        public string? GuestFullName { get; set; }

        public int RoomId { get; set; }
        public string? RoomNumber { get; set; }

        public int WorkerId { get; set; }
        public string? WorkerFullName { get; set; }

        public List<string> AdditionalOffersNames { get; set; } = new List<string>();

        public bool IsActive { get; set; } = true;
    }
}


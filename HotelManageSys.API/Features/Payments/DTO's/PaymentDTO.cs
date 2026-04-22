using HotelManageSys.API.Models.Enums;

namespace HotelManageSys.API.Features.Payments.DTO_s
{
    public class PaymentDTO
    {
        public int PaymentId { get; set; }

        public required string Title { get; set; }

        public string? PaymentStatus { get; set; }
        public string? PaymentMethod { get; set; }

        public decimal Price { get; set; }

        public DateTime PaymentDate { get; set; }

        public int ReservationId { get; set; }

        public bool IsActive { get; set; } = true;
    }
}


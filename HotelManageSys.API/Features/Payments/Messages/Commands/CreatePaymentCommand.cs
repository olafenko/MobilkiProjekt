using HotelManageSys.API.Models.Enums;
using MediatR;

namespace HotelManageSys.API.Features.Payments.Messages.Commands
{
    public class CreatePaymentCommand : IRequest<int>
    {
        public required string Title { get; set; }

        public PaymentStatus PaymentStatus { get; set; }
        public PaymentMethod PaymentMethod { get; set; }

        public decimal Price { get; set; }

        public DateTime PaymentDate { get; set; } = DateTime.Now;

        public int ReservationId { get; set; }
    }
}


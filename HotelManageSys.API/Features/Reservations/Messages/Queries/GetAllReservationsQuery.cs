using HotelManageSys.API.Features.Reservations.DTO_s;
using HotelManageSys.API.Models.Enums;
using MediatR;

namespace HotelManageSys.API.Features.Reservations.Messages.Queries
{
    public class GetAllReservationsQuery : IRequest<IEnumerable<ReservationDTO>>
    {

        public PaymentStatus? PaymentStatus { get; set; }

    }
}


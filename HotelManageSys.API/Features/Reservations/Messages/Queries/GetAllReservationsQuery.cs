using HotelManageSys.API.Features.Reservations.DTO_s;
using MediatR;

namespace HotelManageSys.API.Features.Reservations.Messages.Queries
{
    public class GetAllReservationsQuery : IRequest<IEnumerable<ReservationDTO>>
    {
    }
}


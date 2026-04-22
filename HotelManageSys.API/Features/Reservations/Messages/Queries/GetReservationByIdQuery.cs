using HotelManageSys.API.Features.Reservations.DTO_s;
using MediatR;

namespace HotelManageSys.API.Features.Reservations.Messages.Queries
{
    public class GetReservationByIdQuery : IRequest<ReservationDTO>
    {
        public int Id { get; set; }

        public GetReservationByIdQuery(int id)
        {
            Id = id;
        }
    }
}


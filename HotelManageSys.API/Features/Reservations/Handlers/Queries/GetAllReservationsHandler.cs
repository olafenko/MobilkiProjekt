using HotelManageSys.API.Features.Reservations.DTO_s;
using HotelManageSys.API.Features.Reservations.Messages.Queries;
using HotelManageSys.API.Features.Reservations.Providers;
using Mapster;
using MediatR;

namespace HotelManageSys.API.Features.Reservations.Handlers.Queries
{
    public class GetAllReservationsHandler : IRequestHandler<GetAllReservationsQuery, IEnumerable<ReservationDTO>>
    {
        private readonly IReservationProvider _reservationProvider;

        public GetAllReservationsHandler(IReservationProvider reservationProvider)
        {
            _reservationProvider = reservationProvider;
        }

        public async Task<IEnumerable<ReservationDTO>> Handle(GetAllReservationsQuery request, CancellationToken cancellationToken)
        {
            return (await _reservationProvider.GetAllReservationsAsync(cancellationToken)).Adapt<IEnumerable<ReservationDTO>>();
        }
    }
}


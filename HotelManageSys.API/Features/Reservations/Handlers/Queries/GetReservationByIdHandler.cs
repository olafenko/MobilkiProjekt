using HotelManageSys.API.Features.Reservations.DTO_s;
using HotelManageSys.API.Features.Reservations.Messages.Queries;
using HotelManageSys.API.Features.Reservations.Providers;
using Mapster;
using MediatR;

namespace HotelManageSys.API.Features.Reservations.Handlers.Queries
{
    public class GetReservationByIdHandler : IRequestHandler<GetReservationByIdQuery, ReservationDTO?>
    {
        private readonly IReservationProvider _reservationProvider;

        public GetReservationByIdHandler(IReservationProvider reservationProvider)
        {
            _reservationProvider = reservationProvider;
        }

        public async Task<ReservationDTO?> Handle(GetReservationByIdQuery request, CancellationToken cancellationToken)
        {
            return (await _reservationProvider.GetReservationByIdAsync(request.Id, true, cancellationToken))?.Adapt<ReservationDTO>();
        }
    }
}


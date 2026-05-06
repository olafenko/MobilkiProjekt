using HotelManageSys.API.Features.Reservations.DTO_s;
using HotelManageSys.API.Features.Reservations.Messages.Commands;
using HotelManageSys.API.Models;
using HotelManageSys.API.Models.Enums;
using Mapster;

namespace HotelManageSys.API.Features.Reservations.Mappings
{
    public class ReservationMappingConfig : IRegister
    {
        public void Register(TypeAdapterConfig config)
        {
            config.NewConfig<Reservation, ReservationDTO>()
                .Map(d => d.GuestFullName, src => src.Guest != null ? $"{src.Guest.FirstName} {src.Guest.LastName}" : null)
                .Map(d => d.RoomNumber, src => src.Room != null ? src.Room.Number : null)
                .Map(d => d.RoomTypeName, src => src.Room != null ? src.Room.RoomType.Name : null)
                .Map(d => d.WorkerFullName, src => src.Worker != null ? $"{src.Worker.FirstName} {src.Worker.LastName}" : null)
                .Map(d => d.ReservationStatus, src => src.ReservationStatus.ToString())
                .Map(d => d.NightCount, src => (src.CheckOutDate - src.CheckInDate).Days)
                .Map(d => d.AmountPaid, src => src.Payments != null ? src.Payments.Where(p => p.PaymentStatus == PaymentStatus.PAID).Sum(p => p.Price) : 0)
                .Map(d => d.AmountRemaining, src => src.Payments != null ? src.TotalPrice - src.Payments.Where(p => p.PaymentStatus == PaymentStatus.PAID).Sum(p => p.Price) : 0)
                .Map(d => d.AdditionalOffers, src => src.ReservationAdditionalOffers != null ? src.ReservationAdditionalOffers.Where(rao => rao.IsActive) : new List<ReservationAdditionalOffer>());

            config.NewConfig<CreateReservationCommand, Reservation>()
                .Ignore(d => d.ReservationId)
                .Ignore(d => d.Guest)
                .Ignore(d => d.Room)
                .Ignore(d => d.Worker)
                .Ignore(d => d.ReservationAdditionalOffers)
                .Ignore(d => d.Payments);
        }
    }
}


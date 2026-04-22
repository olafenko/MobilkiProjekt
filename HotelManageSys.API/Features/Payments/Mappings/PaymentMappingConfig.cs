using HotelManageSys.API.Features.Payments.DTO_s;
using HotelManageSys.API.Features.Payments.Messages.Commands;
using HotelManageSys.API.Models;
using Mapster;

namespace HotelManageSys.API.Features.Payments.Mappings
{
    public class PaymentMappingConfig : IRegister
    {
        public void Register(TypeAdapterConfig config)
        {
            config.NewConfig<Payment, PaymentDTO>()
                .Map(d => d.PaymentStatus, src => src.PaymentStatus.ToString())
                .Map(d => d.PaymentMethod, src => src.PaymentMethod.ToString());

            config.NewConfig<CreatePaymentCommand, Payment>()
                .Ignore(d => d.PaymentId)
                .Ignore(d => d.Reservation);
        }
    }
}


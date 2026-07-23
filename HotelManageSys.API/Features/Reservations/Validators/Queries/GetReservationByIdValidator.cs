using FluentValidation;
using HotelManageSys.API.Features.Reservations.Messages.Queries;

namespace HotelManageSys.API.Features.Reservations.Validators.Queries;

public class GetReservationByIdValidator : AbstractValidator<GetReservationByIdQuery>
{
    public GetReservationByIdValidator()
    {
        RuleFor(x => x.Id)
            .GreaterThan(0)
            .WithMessage("Nieprawidłowe ID rezerwacji");
        
    }
}
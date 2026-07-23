using FluentValidation;
using HotelManageSys.API.Features.Reservations.Messages.Commands;

namespace HotelManageSys.API.Features.Reservations.Validators.Commands;

public class DeleteReservationValidator : AbstractValidator<DeleteReservationCommand>
{
    public DeleteReservationValidator()
    {

        RuleFor(x => x.Id)
            .GreaterThan(0)
            .WithMessage("Nieprawidłowe ID rezerwacji");

    }
}
using FluentValidation;
using HotelManageSys.API.Features.Guests.Messages.Commands;

namespace HotelManageSys.API.Features.Guests.Validators.Commands;

public class DeleteGuestValidator : AbstractValidator<DeleteGuestCommand>
{
    public DeleteGuestValidator()
    {
        
        RuleFor(x => x.Id)
            .GreaterThan(0)
            .WithMessage("Nieprawidłowe ID gościa")
            .WithErrorCode("INVALID_ID");
    }
}
using FluentValidation;
using HotelManageSys.API.Features.Guests.Messages.Queries;

namespace HotelManageSys.API.Features.Guests.Validators.Queries;

public class GetGuestByIdValidator : AbstractValidator<GetGuestByIdQuery>
{
    public GetGuestByIdValidator()
    {
        RuleFor(x => x.Id)
            .GreaterThan(0)
            .WithMessage("Nieprawidłowe ID gościa")
            .WithErrorCode("INVALID_ID");
    }
}
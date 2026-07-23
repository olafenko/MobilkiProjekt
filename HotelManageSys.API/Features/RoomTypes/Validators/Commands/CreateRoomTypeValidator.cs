using FluentValidation;
using HotelManageSys.API.Features.RoomTypes.Messages.Commands;

namespace HotelManageSys.API.Features.RoomTypes.Validators.Commands;

public class CreateRoomTypeValidator : AbstractValidator<CreateRoomTypeCommand>
{
    public CreateRoomTypeValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty()
            .WithMessage("Nazwa nie może być pusta")
            .WithErrorCode("ROOMTYPE_NAME_REQUIRED")
            .MaximumLength(25)
            .WithMessage("Nazwa może mieć maksymalnie 25 znaków")
            .WithErrorCode("ROOMTYPE_NAME_TOO_LONG");

        RuleFor(x => x.BasePrice)
            .GreaterThan(0)
                .WithMessage("Cena bazowa musi być większa niż 0")
                .WithErrorCode("BASE_PRICE_TOO_LOW");

        RuleFor(x => x.Description)
            .MaximumLength(200)
                .WithMessage("Opis może mieć maksymalnie 200 znaków")
                .WithErrorCode("DESCRIPTION_TOO_LONG")
            .When(x => !string.IsNullOrEmpty(x.Description));
        
    }
}
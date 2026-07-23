using FluentValidation;
using HotelManageSys.API.Features.ReservationAdditionalOffers.DTO_s;

namespace HotelManageSys.API.Features.ReservationAdditionalOffers.Validators.Commands;

public class CreateReservationAdditionalOffersValidator : AbstractValidator<CreateReservationAdditionalOfferDTO>
{
    public CreateReservationAdditionalOffersValidator()
    {

        RuleFor(x => x.AdditionalOfferId)
            .GreaterThan(0)
            .WithMessage("Wybierz oferte dodatkowa");

        RuleFor(x => x.Quantity)
            .GreaterThan(0)
            .WithMessage("Ilość musi być większa od 0")
            .WithErrorCode("QUANTITY_TOO_LOW")
            .LessThanOrEqualTo(100)
            .WithMessage("Ilość nie może przekraczać 100")
            .WithErrorCode("QUANTITY_TOO_HIGH");

        RuleFor(x => x.Notes)
            .MaximumLength(200)
                .WithMessage("Notatki mogą mieć maksymalnie 200 znaków")
                .WithErrorCode("NOTES_TOO_LONG")
            .When(x => !string.IsNullOrEmpty(x.Notes));

    }
}
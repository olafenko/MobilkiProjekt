using FluentValidation;
using HotelManageSys.API.Features.AdditionalOffers.Messages.Commands;

namespace HotelManageSys.API.Features.AdditionalOffers.Validators.Commands;

public class CreateAdditionalOfferValidator : AbstractValidator<CreateAdditionalOfferCommand>
{
    public CreateAdditionalOfferValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty()
                .WithMessage("Nazwa oferty dodatkowej nie może być pusta")
                .WithErrorCode("ADDITIONALOFFER_NAME_REQUIRED")
            .MaximumLength(30)
                .WithMessage("Nazwa oferty dodatkowej może mieć maksymalnie 5 znaków")
                .WithErrorCode("ADDITIONALOFFER_NAME_TOO_LONG");
        
        RuleFor(x => x.Price)
            .GreaterThan(0)
                .WithMessage("Cena musi być większa niż 0")
                .WithErrorCode("PRICE_TOO_LOW");
        
    }
}
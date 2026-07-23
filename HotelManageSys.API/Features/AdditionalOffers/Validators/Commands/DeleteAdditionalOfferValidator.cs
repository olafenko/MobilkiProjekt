using FluentValidation;
using HotelManageSys.API.Features.AdditionalOffers.Messages.Commands;

namespace HotelManageSys.API.Features.AdditionalOffers.Validators.Commands;

public class DeleteAdditionalOfferValidator : AbstractValidator<DeleteAdditionalOfferCommand>
{
    public DeleteAdditionalOfferValidator()
    {
        RuleFor(x => x.Id)
            .GreaterThan(0)
            .WithMessage("Nieprawidłowe ID oferty dodatkowej")
            .WithErrorCode("INVALID_ID");
    }
}
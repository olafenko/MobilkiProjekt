using FluentValidation;
using HotelManageSys.API.Features.AdditionalOffers.Messages.Queries;

namespace HotelManageSys.API.Features.AdditionalOffers.Validators.Queries;

public class GetAdditionalOfferByIdValidator : AbstractValidator<GetAdditionalOfferByIdQuery>
{
    public GetAdditionalOfferByIdValidator()
    {
        RuleFor(x => x.Id)
            .GreaterThan(0)
            .WithMessage("Nieprawidłowe ID oferty dodatkowej")
            .WithErrorCode("INVALID_ID");
    }
}
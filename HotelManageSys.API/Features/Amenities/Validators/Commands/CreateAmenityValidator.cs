using FluentValidation;
using HotelManageSys.API.Features.Amenities.Messages.Commands;

namespace HotelManageSys.API.Features.Amenities.Validators;

public class CreateAmenityValidator : AbstractValidator<CreateAmenityCommand>
{
    public CreateAmenityValidator()
    {

        RuleFor(x => x.Name)
            .NotNull()
            .WithMessage("Nazwa udogonienia nie może być pusta")
            .WithErrorCode("AMENITY_NAME_REQUIRED")
            .MaximumLength(35)
            .WithMessage("Nazwa udogonienia może mieć maksymalnie 35 znaków.")
            .WithErrorCode("AMENITY_NAME_TOO_LONG");

        RuleFor(x => x.Description)
            .MaximumLength(200)
            .WithMessage("Opis może mieć maksymalnie 200 znaków")
            .WithErrorCode("DESCRIPTION_TOO_LONG")
            .When(x => !string.IsNullOrEmpty(x.Description));
        
        
    }
}
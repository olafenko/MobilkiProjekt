using FluentValidation;
using HotelManageSys.API.Features.Amenities.Messages.Commands;

namespace HotelManageSys.API.Features.Amenities.Validators;

public class DeleteAmenityValidator : AbstractValidator<DeleteAmenityCommand>
{
    public DeleteAmenityValidator()
    {
        RuleFor(x => x.Id)
            .GreaterThan(0)
            .WithMessage("Nieprawidłowe ID udogonienia")
            .WithErrorCode("INVALID_ID");
        
    }
}
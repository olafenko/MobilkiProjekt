using FluentValidation;
using HotelManageSys.API.Features.Amenities.Messages.Queries;

namespace HotelManageSys.API.Features.Amenities.Validators.Queries;

public class GetAmenityByIdValidator : AbstractValidator<GetAmenityByIdQuery>
{
    public GetAmenityByIdValidator()
    {
        RuleFor(x => x.Id)
            .GreaterThan(0)
            .WithMessage("Nieprawidłowe ID udogonienia")
            .WithErrorCode("INVALID_ID");
    }
}
using FluentValidation;
using HotelManageSys.API.Features.Payments.Messages.Queries;

namespace HotelManageSys.API.Features.Payments.Validators.Queries;

public class GetPaymentByIdValidator : AbstractValidator<GetPaymentByIdQuery>
{
    public GetPaymentByIdValidator()
    {
        RuleFor(x => x.Id)
            .GreaterThan(0)
            .WithMessage("Nieprawidłowe ID płatności");
        
    }
}
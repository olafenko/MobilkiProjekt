using FluentValidation;
using HotelManageSys.API.Features.Guests.Messages.Commands;

namespace HotelManageSys.API.Features.Guests.Validators.Commands;

public class CreateGuestValidator : AbstractValidator<CreateGuestCommand>
{
    public CreateGuestValidator()
    {

        RuleFor(x => x.FirstName)
            .NotEmpty()
            .WithMessage("Imię gościa jest wymagane")
            .WithErrorCode("GUEST_NAME_REQUIRED")
            .MaximumLength(60)
            .WithMessage("Imię może mieć maksymalnie 60 znaków")
            .WithErrorCode("GUEST_NAME_TOO_LONG");

        RuleFor(x => x.LastName)
            .NotEmpty()
            .WithMessage("Nazwisko gościa jest wymagane")
            .WithErrorCode("GUEST_LASTNAME_REQUIRED")
            .MaximumLength(60)
            .WithMessage("Nazwisko może mieć maksymalnie 60 znaków")
            .WithErrorCode("GUEST_LASTNAME_TOO_LONG");
        
        RuleFor(x => x.Email)
            .NotEmpty()
            .WithMessage("Email gościa jest wymagany")
            .WithErrorCode("EMAIL_REQUIRED")
            .EmailAddress()
            .WithMessage("Niepoprawny format adresu email")
            .WithErrorCode("INVALID_EMAIL_FORMAT")
            .MaximumLength(100)
            .WithMessage("Email może mieć maksymalnie 100 znaków")
            .WithErrorCode("EMAIl_TOO_LONG");
        
        RuleFor(x => x.PhoneNumber)
            .NotEmpty()
            .WithMessage("Numer telefonu gościa jest wymagany")
            .WithErrorCode("PHONE_NUMBER_REQUIRED")
            .MaximumLength(15)
            .WithMessage("Numer telefonu może mieć maksymalnie 15 znaków")
            .WithErrorCode("PHONE_NUMBER_TOO_LONG");
        
        RuleFor(x => x.IdentityCardNumber)
            .NotEmpty()
            .WithMessage("Numer dokumentu tożsamości gościa jest wymagany")
            .WithErrorCode("IDENTITY_CARD_NUMBER_REQUIRED")
            .MaximumLength(20)
            .WithMessage("Numer dokumentu tożsamości może mieć maksymalnie 20 znaków")
            .WithErrorCode("IDENTITY_CARD_NUMBER_TOO_LONG");
    }
}
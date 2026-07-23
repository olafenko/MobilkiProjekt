using FluentValidation;
using HotelManageSys.API.Features.Payments.Messages.Commands;

namespace HotelManageSys.API.Features.Payments.Validators.Commands;

public class CreatePaymentValidator : AbstractValidator<CreatePaymentCommand>
{
    public CreatePaymentValidator()
    {
        
        RuleFor(x => x.Title)
            .NotEmpty()
                .WithMessage("Tytuł płatności nie może być pusty")
                .WithErrorCode("PAYMENT_TITLE_REQUIRED")
            .MaximumLength(30)
                .WithMessage("Tytuł płatności może mieć maksymalnie 25 znaków")
                .WithErrorCode("PAYMENT_TITLE_TOO_LONG");
        
        RuleFor(x => x.PaymentMethod)
            .NotNull()
            .WithMessage("Metoda płatności jest wymagana")
            .WithErrorCode("PAYMENT_METHOD_REQUIRED")
            .IsInEnum()
            .WithMessage("Podana metoda jest nieprawidłowa")
            .WithErrorCode("PAYMENT_METHOD_UNIDENTIFIED");
        
        RuleFor(x => x.PaymentStatus)
            .NotNull()
            .WithMessage("Status płatności jest wymagany")
            .WithErrorCode("PAYMENT_STATUS_REQUIRED")
            .IsInEnum()
            .WithMessage("Podanay status jest nieprawidłowy")
            .WithErrorCode("PAYMENT_STATUS_UNIDENTIFIED");

        RuleFor(x => x.PaymentDate)
            .GreaterThanOrEqualTo(DateTime.Now.Date)
            .WithMessage("Data płatności nie może być wcześniej niż dzisiejsza data")
            .WithErrorCode("PAYMENT_DATE_INVALID");

        RuleFor(x => x.Price)
            .NotNull()
            .WithMessage("Kwota jest wymagana")
            .WithErrorCode("PRICE_REQUIRED")
            .GreaterThanOrEqualTo(0)
            .WithMessage("Kwota nie może być ujemna")
            .WithErrorCode("PRICE_NEGATIVE")
            .LessThan(1_000_000)
            .WithMessage("Kwota nie może przekraczać 1 000 000")
            .WithErrorCode("PRICE_TOO_HIGH");
        
        
        RuleFor(x => x.ReservationId)
            .GreaterThan(0)
            .WithMessage("Rezerwacja jest wymagana")
            .WithErrorCode("RESERVATION_REQUIRED");
        
        
        
    }
}
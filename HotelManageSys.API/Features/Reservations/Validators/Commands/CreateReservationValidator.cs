using FluentValidation;
using HotelManageSys.API.Features.Guests.Validators.Commands;
using HotelManageSys.API.Features.ReservationAdditionalOffers.Validators.Commands;
using HotelManageSys.API.Features.Reservations.Messages.Commands;

namespace HotelManageSys.API.Features.Reservations.Validators.Commands;

public class CreateReservationValidator : AbstractValidator<CreateReservationCommand>
{
    public CreateReservationValidator()
    {

        RuleFor(x => x.CheckInDate)
            .GreaterThanOrEqualTo( DateTime.Now.Date)
            .WithMessage("Data zameldowania nie może być w przeszłości.")
            .LessThan(x => x.CheckOutDate)
            .WithMessage("Data zameldowania musi być wcześniej niż data wymeldowania.");

        RuleFor(x => x.CheckOutDate)
            .GreaterThan(DateTime.Now.Date)
            .WithMessage("Data wymeldowania nie może być w przeszłości.")
            .GreaterThan(x => x.CheckInDate)
            .WithMessage("Data wymeldowania musi być później niż data zameldowania.");

        RuleFor(x => x.ReservationDate)
            .GreaterThanOrEqualTo(DateTime.Now.Date)
            .WithMessage("Data złożenia rezerwacji nie może być w przeszłości.");

        RuleFor(x => x.RoomId)
            .GreaterThan(0)
            .WithMessage("Pokój jest wymagany")
            .WithErrorCode("ROOM_REQUIRED");
        
        RuleFor(x => x.WorkerId)
            .GreaterThan(0)
            .WithMessage("Pracownik jest wymagany")
            .WithErrorCode("WORKER_REQUIRED");
        
        RuleFor(x => x.ReservationStatus)
            .NotNull()
            .WithMessage("Status rezerwacji jest wymagany")
            .WithErrorCode("RESERVATION_STATUS_REQUIRED")
            .IsInEnum()
            .WithMessage("Podany status jest nieprawidłowy")
            .WithErrorCode("RESERVATION_STATUS_UNIDENTIFIED");

        RuleFor(x => x.NewGuest)
            .SetValidator(new CreateGuestValidator())
            .When(x => x.NewGuest != null);

        RuleFor(x => x.GuestId)
            .GreaterThan(0)
            .WithMessage("Niepoprawne ID gościa")
            .When(x => x.GuestId.HasValue);

        RuleFor(x => x.Notes)
            .MaximumLength(200)
            .WithMessage("Notatki mogą mieć maksymalnie 200 znaków")
            .When(x => !string.IsNullOrEmpty(x.Notes));

        RuleForEach(x => x.AdditionalOffers)
            .SetValidator(new CreateReservationAdditionalOffersValidator());
        
    }
}
using FluentValidation;
using HotelManageSys.API.Features.Reservations.Messages.Commands;

namespace HotelManageSys.API.Features.Reservations.Validators.Commands;

public class UpdateReservationValidator : AbstractValidator<UpdateReservationCommand>
{
    public UpdateReservationValidator()
    {
        RuleFor(x => x.ReservationId)
            .GreaterThan(0)
            .WithMessage("Nieprawidłowe ID rezerwacji");
        
         RuleFor(x => x.CheckInDate)
            .LessThan(x => x.CheckOutDate)
            .WithMessage("Data zameldowania musi być wcześniej niż data wymeldowania.");

        RuleFor(x => x.CheckOutDate)
            .GreaterThan(x => x.CheckInDate)
            .WithMessage("Data wymeldowania musi być później niż data zameldowania.");


        RuleFor(x => x.RoomId)
            .GreaterThan(0)
            .WithMessage("Pokój jest wymagany")
            .WithErrorCode("ROOM_REQUIRED");
        
        RuleFor(x => x.ReservationStatus)
            .NotNull()
            .WithMessage("Status rezerwacji jest wymagany")
            .WithErrorCode("RESERVATION_STATUS_REQUIRED")
            .IsInEnum()
            .WithMessage("Podany status jest nieprawidłowy")
            .WithErrorCode("RESERVATION_STATUS_UNIDENTIFIED");
        
        RuleFor(x => x.Notes)
            .MaximumLength(200)
            .WithMessage("Notatki mogą mieć maksymalnie 200 znaków")
            .When(x => !string.IsNullOrEmpty(x.Notes));

        
    }
}
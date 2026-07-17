using FluentValidation;
using HotelManageSys.API.Features.Rooms.Messages.Commands;

namespace HotelManageSys.API.Features.Rooms.Validators.Commands
{
    public class CreateRoomValidator : AbstractValidator<CreateRoomCommand>
    {
        public CreateRoomValidator()
        {

            RuleFor(x => x.Number)
                .NotEmpty()
                    .WithMessage("Numer pokoju nie może być pusty")
                    .WithErrorCode("ROOM_NUMBER_REQUIRED")
                .MaximumLength(5)
                    .WithMessage("Numer pokoju może mieć maksymalnie 5 znaków")
                    .WithErrorCode("ROOM_NUMBER_TOO_LONG");

            RuleFor(x => x.Floor)
                .InclusiveBetween(0, 5)
                    .WithMessage("Piętro musi zawierać się w przedziale od 0 do 5 włącznie.")
                    .WithErrorCode("FLOOR_INVALID");

            RuleFor(x => x.Description)
                .MaximumLength(200)
                    .WithMessage("Opis może mieć maksymalnie 200 znaków")
                    .WithErrorCode("DESCRIPTION_TOO_LONG")
                .When(x => !string.IsNullOrEmpty(x.Description));

            RuleFor(x => x.Status)
                .NotNull()
                    .WithMessage("Status jest wymagany")
                    .WithErrorCode("STATUS_REQUIRED")
                .IsInEnum()
                    .WithMessage("Podany status jest nieprawidłowy")
                    .WithErrorCode("STATUS_UNIDENTIFIED");

            RuleFor(x => x.RoomTypeId)
                .GreaterThan(0)
                    .WithMessage("Typ pokoju jest wymagany")
                    .WithErrorCode("ROOM_TYPE_REQUIRED");

            RuleForEach(x => x.AmenitiesIds)
                .GreaterThan(0)
                    .WithMessage("Nieprawidłowe ID udogodnienia")
                .When(x => x.AmenitiesIds.Any());

        }
    }
}

using FluentValidation;
using HotelManageSys.API.Features.Rooms.Messages.Commands;

namespace HotelManageSys.API.Features.Rooms.Validators.Commands
{
    public class DeleteRoomValidator : AbstractValidator<DeleteRoomCommand>
    {
        public DeleteRoomValidator()
        {

            RuleFor(x => x.Id)
                .GreaterThan(0)
                .WithMessage("Niepoprawne ID pokoju.")
                .WithErrorCode("INVALID_ID");

        }
    }
}

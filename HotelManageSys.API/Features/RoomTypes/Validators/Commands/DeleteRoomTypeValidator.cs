using FluentValidation;
using HotelManageSys.API.Features.RoomTypes.Messages.Commands;

namespace HotelManageSys.API.Features.RoomTypes.Validators.Commands;

public class DeleteRoomTypeValidator : AbstractValidator<DeleteRoomTypeCommand>
{
    public DeleteRoomTypeValidator()
    {
        
        RuleFor(x => x.Id)
            .GreaterThan(0)
            .WithMessage("Niepoprawne ID typu pokoju")
            .WithErrorCode("INVALID_ID");
        
    }
}
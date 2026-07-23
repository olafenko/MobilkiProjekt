using FluentValidation;
using HotelManageSys.API.Features.Rooms.Messages.Queries;

namespace HotelManageSys.API.Features.Rooms.Validators.Queries;

public class GetRoomByIdValidator : AbstractValidator<GetRoomByIdQuery>
{
    public GetRoomByIdValidator()
    {

        RuleFor(x => x.Id)
            .GreaterThan(0)
            .WithMessage("Nieprawidłowe ID pokoju")
            .WithErrorCode("INVALID_ROOM_ID");
    }
}
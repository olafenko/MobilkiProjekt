using FluentValidation;
using HotelManageSys.API.Features.RoomTypes.Messages.Queries;

namespace HotelManageSys.API.Features.RoomTypes.Validators.Queries;

public class GetRoomTypeByIdValidator : AbstractValidator<GetRoomTypeByIdQuery>
{
    public GetRoomTypeByIdValidator()
    {
        RuleFor(x => x.Id)
            .GreaterThan(0)
            .WithMessage("Niepoprawne ID typu pokoju")
            .WithErrorCode("INVALID_ID");
        
    }
}
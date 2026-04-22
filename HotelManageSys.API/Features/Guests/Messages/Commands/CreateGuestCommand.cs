using MediatR;

namespace HotelManageSys.API.Features.Guests.Messages.Commands
{
    public class CreateGuestCommand : IRequest<int>
    {
        public required string FirstName { get; set; }
        public required string LastName { get; set; }
        public required string PhoneNumber { get; set; }
        public required string Email { get; set; }
        public required string IdentityCardNumber { get; set; }
    }
}


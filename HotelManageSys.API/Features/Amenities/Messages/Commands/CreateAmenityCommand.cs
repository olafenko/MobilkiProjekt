using MediatR;

namespace HotelManageSys.API.Features.Amenities.Messages.Commands
{
    public class CreateAmenityCommand : IRequest<int>
    {
        public required string Name { get; set; }
        public string? Description { get; set; }
    }
}


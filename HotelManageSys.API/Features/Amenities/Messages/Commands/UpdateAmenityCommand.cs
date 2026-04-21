using MediatR;

namespace HotelManageSys.API.Features.Amenities.Messages.Commands
{
    public class UpdateAmenityCommand : IRequest<Unit>
    {
        public int AmenityId { get; set; }
        public required string Name { get; set; }
        public string? Description { get; set; }
        public bool IsActive { get; set; } = true;
    }
}


using MediatR;

namespace HotelManageSys.API.Features.Amenities.Messages.Commands
{
    public class DeleteAmenityCommand : IRequest<Unit>
    {
        public int Id { get; set; }

        public DeleteAmenityCommand(int id)
        {
            Id = id;
        }
    }
}


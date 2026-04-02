using HotelManageSys.API.Features.Rooms.Messages.Queries;
using HotelManageSys.API.Models.Data;
using Mapster;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HotelManageSys.API.Features.Rooms.Handlers.Queries
{
    public class GetAllRoomsHandler : IRequestHandler<GetAllRoomsQuery, IEnumerable<RoomDTO>>
    {

        private readonly ApplicationDbContext _dbContext;

        public GetAllRoomsHandler(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<IEnumerable<RoomDTO>> Handle(GetAllRoomsQuery request, CancellationToken cancellationToken)
        {
            

            var rooms = await _dbContext.Rooms
                .AsNoTracking()
                .Include(r => r.RoomType)
                .Include(r => r.Amenities)
                .Where(r => r.IsActive)
                .OrderBy(r => r.Number)
                .ToListAsync(cancellationToken);

            return rooms.Adapt<IEnumerable<RoomDTO>>();

        }
    }
}

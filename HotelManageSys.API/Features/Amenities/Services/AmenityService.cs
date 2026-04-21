using HotelManageSys.API.Models;
using HotelManageSys.API.Models.Data;

namespace HotelManageSys.API.Features.Amenities.Services
{
    public class AmenityService : IAmenityService
    {
        private readonly ApplicationDbContext _context;

        public AmenityService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task CreateAmenity(Amenity amenity, CancellationToken cancellationToken = default)
        {
            _context.Add(amenity);
            await _context.SaveChangesAsync(cancellationToken);
        }

        public async Task UpdateAmenity(Amenity amenity, CancellationToken cancellationToken = default)
        {
            await _context.SaveChangesAsync(cancellationToken);
        }

        public async Task DeleteAmenity(Amenity amenity, CancellationToken cancellationToken = default)
        {
            amenity.IsActive = false;
            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}

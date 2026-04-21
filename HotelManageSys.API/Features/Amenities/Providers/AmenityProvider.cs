using HotelManageSys.API.Models;
using HotelManageSys.API.Models.Data;
using Microsoft.EntityFrameworkCore;

namespace HotelManageSys.API.Features.Amenities.Providers
{
    public class AmenityProvider : IAmenityProvider
    {
        private readonly ApplicationDbContext _dbContext;

        public AmenityProvider(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<IEnumerable<Amenity>> GetAllAmenitiesAsync(CancellationToken cancellationToken = default)
        {
            return await _dbContext.Amenities
                .AsNoTracking()
                .Include(a => a.Rooms)
                .Where(a => a.IsActive)
                .OrderBy(a => a.Name)
                .ToListAsync(cancellationToken);
        }

        public async Task<Amenity> GetAmenityByIdAsync(int amenityId, bool asNoTracking = true, CancellationToken cancellationToken = default)
        {
            IQueryable<Amenity> query = _dbContext.Amenities
                .Include(a => a.Rooms);

            if (asNoTracking)
            {
                query = query.AsNoTracking();
            }

            var amenity = await query.FirstOrDefaultAsync(a => a.IsActive && a.AmenityId == amenityId, cancellationToken);

            return amenity ?? throw new KeyNotFoundException($"Nie znaleziono udogodnienia o ID {amenityId}");
        }
    }
}

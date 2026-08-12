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

        public async Task<Amenity?> GetAmenityByIdAsync(int amenityId, bool asNoTracking = true, CancellationToken cancellationToken = default)
        {
            IQueryable<Amenity> query = _dbContext.Amenities;

            if (asNoTracking)
            {
                query = query.AsNoTracking();
            }

            var amenity = await  query.FirstOrDefaultAsync(a => a.IsActive && a.AmenityId == amenityId,cancellationToken);


            return amenity;
        }

        public async Task<List<Amenity>> GetAmenitiesByIdsAsync(IEnumerable<int> amenityIds, bool asNoTracking = true, CancellationToken cancellationToken = default)
        {
            var ids = amenityIds
                .Where(id => id > 0)
                .Distinct()
                .ToList();

            if (ids.Count == 0)
            {
                return new List<Amenity>();
            }

            IQueryable<Amenity> query = _dbContext.Amenities;

            if (asNoTracking)
            {
                query = query.AsNoTracking();
            }

            var amenities = await query
                .Where(a => a.IsActive && ids.Contains(a.AmenityId))
                .ToListAsync(cancellationToken);

            var foundIds = amenities.Select(a => a.AmenityId).ToHashSet();
            var missingIds = ids.Where(id => !foundIds.Contains(id)).ToList();

            if (missingIds.Count > 0)
            {
                throw new KeyNotFoundException($"Nie znaleziono udogodnień o ID: {string.Join(", ", missingIds)}");
            }

            return amenities;
        }

        public async Task<bool> AmenityExistsByName(string name, CancellationToken cancellationToken = default)
        {
            return await _dbContext.Amenities.AnyAsync(a => a.Name == name && a.IsActive, cancellationToken);
        }

        public async Task<bool> AmenityExistsByName(string name, int amenityId, CancellationToken cancellationToken = default)
        {
            return await _dbContext.Amenities.AnyAsync(a => a.Name == name && a.AmenityId != amenityId && a.IsActive, cancellationToken);
        }
    }
}

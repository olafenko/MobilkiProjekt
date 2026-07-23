using HotelManageSys.API.Models;

namespace HotelManageSys.API.Features.Amenities.Providers
{
    public interface IAmenityProvider
    {
        Task<IEnumerable<Amenity>> GetAllAmenitiesAsync(CancellationToken cancellationToken = default);

        Task<Amenity?> GetAmenityByIdAsync(int amenityId, bool asNoTracking = true, CancellationToken cancellationToken = default);

        Task<List<Amenity>> GetAmenitiesByIdsAsync(IEnumerable<int> amenityIds, bool asNoTracking = true, CancellationToken cancellationToken = default);
        Task<bool> AmenityExistsByName(string name, CancellationToken cancellationToken = default);
    }
}

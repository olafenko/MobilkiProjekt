using HotelManageSys.API.Models;

namespace HotelManageSys.API.Features.Amenities.Providers
{
    public interface IAmenityProvider
    {
        Task<IEnumerable<Amenity>> GetAllAmenitiesAsync(CancellationToken cancellationToken = default);

        Task<Amenity> GetAmenityByIdAsync(int amenityId, bool asNoTracking = true, CancellationToken cancellationToken = default);
    }
}

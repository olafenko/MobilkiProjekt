using HotelManageSys.API.Models;

namespace HotelManageSys.API.Features.Amenities.Services
{
    public interface IAmenityService
    {
        Task CreateAmenity(Amenity amenity, CancellationToken cancellationToken = default);
        Task UpdateAmenity(Amenity amenity, CancellationToken cancellationToken = default);
        Task DeleteAmenity(Amenity amenity, CancellationToken cancellationToken = default);
    }
}

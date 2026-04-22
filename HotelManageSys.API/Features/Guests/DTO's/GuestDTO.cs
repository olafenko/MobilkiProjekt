namespace HotelManageSys.API.Features.Guests.DTO_s
{
    public class GuestDTO
    {
        public int GuestId { get; set; }

        public required string FirstName { get; set; }
        public required string LastName { get; set; }

        public required string PhoneNumber { get; set; }
        public required string Email { get; set; }

        public required string IdentityCardNumber { get; set; }

        public bool IsActive { get; set; } = true;
    }
}


namespace HotelManageSys.API.Models
{
    public class Guest
    {

        public int GuestId { get; set; }

        public required string FirstName{ get; set; }
        public required string LastName{ get; set; }

        public required string PhoneNumber { get; set; }
        public required string Email{ get; set; }

        public required string IdentityCardNumber { get; set; }

        public bool IsActive { get; set; }

        public virtual ICollection<Reservation> Reservations { get; set; } = new List<Reservation>();
    }
}
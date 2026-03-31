namespace HotelManageSys.API.Models
{
    public class Worker
    {

        public int WorkerId { get; set; }

        public required string FirstName{ get; set; }
        public required string LastName{ get; set; }
        public required string Login{ get; set; }
        public required string Password{ get; set; }
        public bool IsActive { get; set; } = true;

        public virtual ICollection<Reservation> Reservations { get; set; } = new List<Reservation>();


    }
}
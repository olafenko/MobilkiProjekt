namespace HotelManageSys.API.Models
{
    public class HotelService
    {


        public int HotelServiceId { get; set; }
        public required string Name { get; set; }
        public decimal Price { get; set; }
        public bool IsActive { get; set; } = true;

        public virtual ICollection<ReservationHotelService> ReservationHotelServices { get; set; } = new List<ReservationHotelService>();

    }
}
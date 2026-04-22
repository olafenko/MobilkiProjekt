namespace HotelManageSys.API.Features.Workers.DTO_s
{
    public class WorkerDTO
    {
        public int WorkerId { get; set; }

        public required string FirstName { get; set; }
        public required string LastName { get; set; }

        public required string Login { get; set; }

        public bool IsActive { get; set; } = true;
    }
}


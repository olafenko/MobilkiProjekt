using HotelManageSys.API.Features.Workers.DTO_s;
using MediatR;

namespace HotelManageSys.API.Features.Workers.Messages.Queries
{
    public class GetWorkerByIdQuery : IRequest<WorkerDTO>
    {
        public int Id { get; set; }

        public GetWorkerByIdQuery(int id)
        {
            Id = id;
        }
    }
}


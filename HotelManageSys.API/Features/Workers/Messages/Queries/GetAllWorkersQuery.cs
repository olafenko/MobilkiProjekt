using HotelManageSys.API.Features.Workers.DTO_s;
using MediatR;

namespace HotelManageSys.API.Features.Workers.Messages.Queries
{
    public class GetAllWorkersQuery : IRequest<IEnumerable<WorkerDTO>>
    {
    }
}


using HotelManageSys.API.Features.Workers.DTO_s;
using HotelManageSys.API.Features.Workers.Messages.Queries;
using HotelManageSys.API.Features.Workers.Providers;
using Mapster;
using MediatR;

namespace HotelManageSys.API.Features.Workers.Handlers.Queries
{
    public class GetAllWorkersHandler : IRequestHandler<GetAllWorkersQuery, IEnumerable<WorkerDTO>>
    {
        private readonly IWorkerProvider _workerProvider;

        public GetAllWorkersHandler(IWorkerProvider workerProvider)
        {
            _workerProvider = workerProvider;
        }

        public async Task<IEnumerable<WorkerDTO>> Handle(GetAllWorkersQuery request, CancellationToken cancellationToken)
        {
            return (await _workerProvider.GetAllWorkersAsync(cancellationToken)).Adapt<IEnumerable<WorkerDTO>>();
        }
    }
}


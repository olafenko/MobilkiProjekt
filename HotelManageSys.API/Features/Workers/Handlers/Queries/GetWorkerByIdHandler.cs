using HotelManageSys.API.Features.Workers.DTO_s;
using HotelManageSys.API.Features.Workers.Messages.Queries;
using HotelManageSys.API.Features.Workers.Providers;
using Mapster;
using MediatR;

namespace HotelManageSys.API.Features.Workers.Handlers.Queries
{
    public class GetWorkerByIdHandler : IRequestHandler<GetWorkerByIdQuery, WorkerDTO?>
    {
        private readonly IWorkerProvider _workerProvider;

        public GetWorkerByIdHandler(IWorkerProvider workerProvider)
        {
            _workerProvider = workerProvider;
        }

        public async Task<WorkerDTO?> Handle(GetWorkerByIdQuery request, CancellationToken cancellationToken)
        {
            return (await _workerProvider.GetWorkerByIdAsync(request.Id, true, cancellationToken))?.Adapt<WorkerDTO>();
        }
    }
}


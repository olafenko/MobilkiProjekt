using HotelManageSys.API.Features.Workers.Messages.Commands;
using HotelManageSys.API.Features.Workers.Providers;
using HotelManageSys.API.Features.Workers.Services;
using Mapster;
using MediatR;

namespace HotelManageSys.API.Features.Workers.Handlers.Commands
{
    public class UpdateWorkerHandler : IRequestHandler<UpdateWorkerCommand, Unit>
    {
        private readonly IWorkerService _workerService;
        private readonly ILogger<UpdateWorkerHandler> _logger;
        private readonly IWorkerProvider _workerProvider;

        public UpdateWorkerHandler(IWorkerService workerService, ILogger<UpdateWorkerHandler> logger, IWorkerProvider workerProvider)
        {
            _workerService = workerService;
            _logger = logger;
            _workerProvider = workerProvider;
        }

        public async Task<Unit> Handle(UpdateWorkerCommand request, CancellationToken cancellationToken)
        {
            var worker = await _workerProvider.GetWorkerByIdAsync(request.WorkerId, false, cancellationToken);

            _logger.LogInformation("Aktualizowanie pracownika ID: {WorkerId}", request.WorkerId);

            request.Adapt(worker);

            await _workerService.UpdateWorker(worker, cancellationToken);

            _logger.LogInformation("Zaaktualizowano pracownika ID: {WorkerId}", request.WorkerId);

            return Unit.Value;
        }
    }
}


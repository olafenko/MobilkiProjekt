using HotelManageSys.API.Features.Workers.Messages.Commands;
using HotelManageSys.API.Features.Workers.Providers;
using HotelManageSys.API.Features.Workers.Services;
using MediatR;

namespace HotelManageSys.API.Features.Workers.Handlers.Commands
{
    public class DeleteWorkerHandler : IRequestHandler<DeleteWorkerCommand, Unit>
    {
        private readonly IWorkerService _workerService;
        private readonly ILogger<DeleteWorkerHandler> _logger;
        private readonly IWorkerProvider _workerProvider;

        public DeleteWorkerHandler(IWorkerService workerService, ILogger<DeleteWorkerHandler> logger, IWorkerProvider workerProvider)
        {
            _workerService = workerService;
            _logger = logger;
            _workerProvider = workerProvider;
        }

        public async Task<Unit> Handle(DeleteWorkerCommand request, CancellationToken cancellationToken)
        {
            var worker = await _workerProvider.GetWorkerByIdAsync(request.Id, false, cancellationToken);

            _logger.LogInformation("Usuwanie pracownika ID: {WorkerId}", request.Id);

            await _workerService.DeleteWorker(worker, cancellationToken);

            _logger.LogInformation("Usunięto pracownika ID: {WorkerId}", request.Id);

            return Unit.Value;
        }
    }
}


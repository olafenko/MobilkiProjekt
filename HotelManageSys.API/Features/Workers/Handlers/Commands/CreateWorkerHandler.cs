using HotelManageSys.API.Features.Workers.Messages.Commands;
using HotelManageSys.API.Features.Workers.Services;
using HotelManageSys.API.Models;
using Mapster;
using MediatR;

namespace HotelManageSys.API.Features.Workers.Handlers.Commands
{
    public class CreateWorkerHandler : IRequestHandler<CreateWorkerCommand, int>
    {
        private readonly IWorkerService _workerService;
        private readonly ILogger<CreateWorkerHandler> _logger;

        public CreateWorkerHandler(IWorkerService workerService, ILogger<CreateWorkerHandler> logger)
        {
            _workerService = workerService;
            _logger = logger;
        }

        public async Task<int> Handle(CreateWorkerCommand request, CancellationToken cancellationToken)
        {
            _logger.LogInformation("Dodawanie nowego pracownika: {FirstName} {LastName}", request.FirstName, request.LastName);

            var worker = request.Adapt<Worker>();

            await _workerService.CreateWorker(worker, cancellationToken);

            _logger.LogInformation("Dodano pracownika ID: {WorkerId}", worker.WorkerId);

            return worker.WorkerId;
        }
    }
}


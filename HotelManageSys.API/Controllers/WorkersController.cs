using HotelManageSys.API.Features.Workers.DTO_s;
using HotelManageSys.API.Features.Workers.Messages.Commands;
using HotelManageSys.API.Features.Workers.Messages.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace HotelManageSys.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WorkersController : ControllerBase
    {
        private readonly IMediator _mediator;

        public WorkersController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        [ProducesResponseType(typeof(List<WorkerDTO>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetAllWorkers()
        {
            var query = new GetAllWorkersQuery();
            return Ok(await _mediator.Send(query));
        }

        [HttpGet("{id}")]
        [ProducesResponseType(typeof(WorkerDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetWorkerById(int id)
        {
            var query = new GetWorkerByIdQuery(id);

            var result = await _mediator.Send(query);

            return result != null ? Ok(result) : NotFound($"Pracownik o ID {id} nie istnieje");
        }

        [HttpPost]
        [ProducesResponseType(typeof(int), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> CreateWorker([FromBody] CreateWorkerCommand createCommand)
        {
            var workerId = await _mediator.Send(createCommand);

            return CreatedAtAction(
                nameof(GetWorkerById),
                new { id = workerId },
                new { id = workerId, message = "Pracownik został utworzony" }
            );
        }

        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> UpdateWorker(int id, [FromBody] UpdateWorkerCommand updateCommand)
        {
            if (id != updateCommand.WorkerId)
            {
                return BadRequest("Id w URL nie jest takie samo jak w body");
            }

            try
            {
                await _mediator.Send(updateCommand);
                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
        }

        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DeleteWorker(int id)
        {
            var deleteCommand = new DeleteWorkerCommand(id);

            try
            {
                await _mediator.Send(deleteCommand);
                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
        }
    }
}


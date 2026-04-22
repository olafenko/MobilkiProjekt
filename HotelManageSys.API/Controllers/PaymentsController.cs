using HotelManageSys.API.Features.Payments.DTO_s;
using HotelManageSys.API.Features.Payments.Messages.Commands;
using HotelManageSys.API.Features.Payments.Messages.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace HotelManageSys.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentsController : ControllerBase
    {
        private readonly IMediator _mediator;

        public PaymentsController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        [ProducesResponseType(typeof(List<PaymentDTO>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetAllPayments()
        {
            var query = new GetAllPaymentsQuery();
            return Ok(await _mediator.Send(query));
        }

        [HttpGet("{id}")]
        [ProducesResponseType(typeof(PaymentDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetPaymentById(int id)
        {
            var query = new GetPaymentByIdQuery(id);

            var result = await _mediator.Send(query);

            return result != null ? Ok(result) : NotFound($"Płatność o ID {id} nie istnieje");
        }

        [HttpPost]
        [ProducesResponseType(typeof(int), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> CreatePayment([FromBody] CreatePaymentCommand createCommand)
        {
            var paymentId = await _mediator.Send(createCommand);

            return CreatedAtAction(
                nameof(GetPaymentById),
                new { id = paymentId },
                new { id = paymentId, message = "Płatność została utworzona" }
            );
        }

        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> UpdatePayment(int id, [FromBody] UpdatePaymentCommand updateCommand)
        {
            if (id != updateCommand.PaymentId)
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
        public async Task<IActionResult> DeletePayment(int id)
        {
            var deleteCommand = new DeletePaymentCommand(id);

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


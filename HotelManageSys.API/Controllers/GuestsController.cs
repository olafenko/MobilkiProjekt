using HotelManageSys.API.Features.Guests.DTO_s;
using HotelManageSys.API.Features.Guests.Messages.Commands;
using HotelManageSys.API.Features.Guests.Messages.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace HotelManageSys.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GuestsController : ControllerBase
    {
        private readonly IMediator _mediator;

        public GuestsController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        [ProducesResponseType(typeof(List<GuestDTO>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetAllGuests()
        {
            var query = new GetAllGuestsQuery();
            return Ok(await _mediator.Send(query));
        }

        [HttpGet("{id}")]
        [ProducesResponseType(typeof(GuestDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetGuestById(int id)
        {
            var query = new GetGuestByIdQuery(id);

            var result = await _mediator.Send(query);

            return result != null ? Ok(result) : NotFound($"Gość o ID {id} nie istnieje");
        }

        [HttpPost]
        [ProducesResponseType(typeof(int), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> CreateGuest([FromBody] CreateGuestCommand createCommand)
        {
            var guestId = await _mediator.Send(createCommand);

            return CreatedAtAction(
                nameof(GetGuestById),
                new { id = guestId },
                new { id = guestId, message = "Gość został utworzony" }
            );
        }

        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> UpdateGuest(int id, [FromBody] UpdateGuestCommand updateCommand)
        {
            if (id != updateCommand.GuestId)
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
        public async Task<IActionResult> DeleteGuest(int id)
        {
            var deleteCommand = new DeleteGuestCommand(id);

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


using HotelManageSys.API.Features.Rooms.Messages.Queries;
using HotelManageSys.API.Features.RoomTypes.DTO_s;
using HotelManageSys.API.Features.RoomTypes.Messages.Commands;
using HotelManageSys.API.Features.RoomTypes.Messages.Queries;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace HotelManageSys.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoomTypesController : ControllerBase
    {

        private readonly IMediator _mediator;

        public RoomTypesController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        [ProducesResponseType(typeof(List<RoomTypeDTO>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetAllRoomTypes()
        {
            var query = new GetAllRoomTypesQuery();
            return  Ok(await _mediator.Send(query));
        }

        [HttpGet("{id}")]
        [ProducesResponseType(typeof(RoomTypeDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetRoomTypeById(int id)
        {
            var query = new GetRoomTypeByIdQuery(id);

            var result = await _mediator.Send(query);

            return result != null ? Ok(result) : NotFound($"Typ pokoju o {id} nie istnieje");
        }

        [HttpPost]
        [ProducesResponseType(typeof(int), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> CreateRoomType([FromBody] CreateRoomTypeCommand createCommand)
        {
            var roomTypeId = await _mediator.Send(createCommand);

            return CreatedAtAction(
                nameof(GetRoomTypeById),
                new { id = roomTypeId },
                new { id = roomTypeId, message = "Typ pokoju został utworzony" }
            );
        }

        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> UpdateRoomType(int id, [FromBody] UpdateRoomTypeCommand updateCommand)
        {
            if (id != updateCommand.RoomTypeId)
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
        public async Task<IActionResult> DeleteRoomType(int id)
        {
            var deleteCommand = new DeleteRoomTypeCommand(id);

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

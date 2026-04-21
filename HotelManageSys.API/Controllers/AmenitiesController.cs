using HotelManageSys.API.Features.Amenities.DTO_s;
using HotelManageSys.API.Features.Amenities.Messages.Commands;
using HotelManageSys.API.Features.Amenities.Messages.Queries;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace HotelManageSys.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AmenitiesController : ControllerBase
    {
        private readonly IMediator _mediator;

        public AmenitiesController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        [ProducesResponseType(typeof(List<AmenityDTO>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetAllAmenities()
        {
            var query = new GetAllAmenitiesQuery();
            return Ok(await _mediator.Send(query));
        }

        [HttpGet("{id}")]
        [ProducesResponseType(typeof(AmenityDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetAmenityById(int id)
        {
            var query = new GetAmenityByIdQuery(id);

            var result = await _mediator.Send(query);

            return result != null ? Ok(result) : NotFound($"Udogodnienie o ID {id} nie istnieje");
        }

        [HttpPost]
        [ProducesResponseType(typeof(int), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> CreateAmenity([FromBody] CreateAmenityCommand createCommand)
        {
            var amenityId = await _mediator.Send(createCommand);

            return CreatedAtAction(
                nameof(GetAmenityById),
                new { id = amenityId },
                new { id = amenityId, message = "Udogodnienie zostało utworzone" }
            );
        }

        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> UpdateAmenity(int id, [FromBody] UpdateAmenityCommand updateCommand)
        {
            if (id != updateCommand.AmenityId)
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
        public async Task<IActionResult> DeleteAmenity(int id)
        {
            var deleteCommand = new DeleteAmenityCommand(id);

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


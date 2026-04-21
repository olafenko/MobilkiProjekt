using HotelManageSys.API.Features.AdditionalOffers.DTO_s;
using HotelManageSys.API.Features.AdditionalOffers.Messages.Commands;
using HotelManageSys.API.Features.AdditionalOffers.Messages.Queries;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace HotelManageSys.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdditionalOffersController : ControllerBase
    {
        private readonly IMediator _mediator;

        public AdditionalOffersController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        [ProducesResponseType(typeof(List<AdditionalOfferDTO>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetAllAdditionalOffers()
        {
            var query = new GetAllAdditionalOffersQuery();
            return Ok(await _mediator.Send(query));
        }

        [HttpGet("{id}")]
        [ProducesResponseType(typeof(AdditionalOfferDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetAdditionalOfferById(int id)
        {
            var query = new GetAdditionalOfferByIdQuery(id);

            var result = await _mediator.Send(query);

            return result != null ? Ok(result) : NotFound($"Oferta dodatkowa o ID {id} nie istnieje");
        }

        [HttpPost]
        [ProducesResponseType(typeof(int), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> CreateAdditionalOffer([FromBody] CreateAdditionalOfferCommand createCommand)
        {
            var additionalOfferId = await _mediator.Send(createCommand);

            return CreatedAtAction(
                nameof(GetAdditionalOfferById),
                new { id = additionalOfferId },
                new { id = additionalOfferId, message = "Oferta dodatkowa została utworzona" }
            );
        }

        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> UpdateAdditionalOffer(int id, [FromBody] UpdateAdditionalOfferCommand updateCommand)
        {
            if (id != updateCommand.AdditionalOfferId)
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
        public async Task<IActionResult> DeleteAdditionalOffer(int id)
        {
            var deleteCommand = new DeleteAdditionalOfferCommand(id);

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


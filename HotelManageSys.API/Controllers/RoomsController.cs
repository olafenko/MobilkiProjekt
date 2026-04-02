
using HotelManageSys.API.Features.Rooms.Messages.Queries;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace HotelManageSys.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoomsController : ControllerBase
    {

        private readonly IMediator _mediator;

        public RoomsController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        [ProducesResponseType(typeof(List<RoomDTO>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetAllRooms()
        {

            var query = new GetAllRoomsQuery();

            return Ok(await _mediator.Send(query));

        }




    }
}

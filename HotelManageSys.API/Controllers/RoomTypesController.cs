using HotelManageSys.API.Features.RoomTypes.DTO_s;
using HotelManageSys.API.Features.RoomTypes.Messages.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace HotelManageSys.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoomTypesController : Controller
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
    }
}

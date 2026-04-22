using HotelManageSys.API.Features.Workers.DTO_s;
using HotelManageSys.API.Features.Workers.Messages.Commands;
using HotelManageSys.API.Models;
using Mapster;

namespace HotelManageSys.API.Features.Workers.Mappings
{
    public class WorkerMappingConfig : IRegister
    {
        public void Register(TypeAdapterConfig config)
        {
            config.NewConfig<Worker, WorkerDTO>();

            config.NewConfig<CreateWorkerCommand, Worker>()
                .Ignore(d => d.WorkerId)
                .Ignore(d => d.Reservations);
        }
    }
}


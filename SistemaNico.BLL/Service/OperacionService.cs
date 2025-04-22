using SistemaNico.DAL.Repository;
using SistemaNico.Models;

namespace SistemaNico.BLL.Service
{
    public class OperacionesService : IOperacionesService
    {

        private readonly IOperacionesRepository<Operaciones> _contactRepo;

        public OperacionesService(IOperacionesRepository<Operaciones> contactRepo)
        {
            _contactRepo = contactRepo;
        }
        public async Task<bool> Actualizar(Operaciones model)
        {
            return await _contactRepo.Actualizar(model);
        }

        public async Task<bool> Eliminar(int id)
        {
            return await _contactRepo.Eliminar(id);
        }

        public async Task<bool> Insertar(Operaciones model)
        {
            return await _contactRepo.Insertar(model);
        }

        public async Task<Operaciones> Obtener(int id)
        {
            return await _contactRepo.Obtener(id);
        }


        public async Task<IQueryable<Operaciones>> ObtenerTodos(DateTime FechaDesde, DateTime FechaHasta, int IdTipoOperacion, int IdPuntoVenta, int IdUsuario)
        {
            return await _contactRepo.ObtenerTodos(FechaDesde, FechaHasta, IdTipoOperacion, IdPuntoVenta, IdUsuario);
        }

        public async Task<IQueryable<OperacionesTipo>> ObtenerTipos()
        {
            return await _contactRepo.ObtenerTipos();
        }



    }
}

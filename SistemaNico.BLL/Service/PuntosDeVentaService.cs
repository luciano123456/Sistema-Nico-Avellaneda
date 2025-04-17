using SistemaNico.DAL.Repository;
using SistemaNico.Models;

namespace SistemaNico.BLL.Service
{
    public class PuntosDeVentaService : IPuntosDeVentaService
    {

        private readonly IPuntosDeVentaRepository<PuntosDeVenta> _contactRepo;

        public PuntosDeVentaService(IPuntosDeVentaRepository<PuntosDeVenta> contactRepo)
        {
            _contactRepo = contactRepo;
        }
        public async Task<bool> Actualizar(PuntosDeVenta model)
        {
            return await _contactRepo.Actualizar(model);
        }

        public async Task<bool> Eliminar(int id)
        {
            return await _contactRepo.Eliminar(id);
        }

        public async Task<bool> Insertar(PuntosDeVenta model)
        {
            return await _contactRepo.Insertar(model);
        }

        public async Task<PuntosDeVenta> Obtener(int id)
        {
            return await _contactRepo.Obtener(id);
        }


        public async Task<IQueryable<PuntosDeVenta>> ObtenerTodos()
        {
            return await _contactRepo.ObtenerTodos();
        }

        public async Task<IQueryable<PuntosDeVenta>> ObtenerActivos()
        {
            return await _contactRepo.ObtenerActivos();
        }



    }
}

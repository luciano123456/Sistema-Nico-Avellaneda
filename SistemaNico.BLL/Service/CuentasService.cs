using SistemaNico.DAL.Repository;
using SistemaNico.Models;

namespace SistemaNico.BLL.Service
{
    public class CuentasService : ICuentasService
    {

        private readonly ICuentasRepository<Cuenta> _contactRepo;

        public CuentasService(ICuentasRepository<Cuenta> contactRepo)
        {
            _contactRepo = contactRepo;
        }
        public async Task<bool> Actualizar(Cuenta model)
        {
            return await _contactRepo.Actualizar(model);
        }

        public async Task<bool> Eliminar(int id)
        {
            return await _contactRepo.Eliminar(id);
        }

        public async Task<bool> Insertar(Cuenta model)
        {
            return await _contactRepo.Insertar(model);
        }

        public async Task<Cuenta> Obtener(int id)
        {
            return await _contactRepo.Obtener(id);
        }

        public async Task<IQueryable<Cuenta>> ObtenerPorMoneda(int IdMoneda)
        {
            return await _contactRepo.ObtenerPorMoneda(IdMoneda);
        }

        public async Task<IQueryable<Cuenta>> ObtenerTodos()
        {
            return await _contactRepo.ObtenerTodos();
        }

        public async Task<IQueryable<Cuenta>> ObtenerActivos()
        {
            return await _contactRepo.ObtenerActivos();
        }



    }
}

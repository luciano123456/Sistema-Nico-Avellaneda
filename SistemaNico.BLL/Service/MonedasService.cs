using SistemaNico.DAL.Repository;
using SistemaNico.Models;

namespace SistemaNico.BLL.Service
{
    public class MonedasService : IMonedasService
    {

        private readonly IMonedasRepository<Moneda> _contactRepo;

        public MonedasService(IMonedasRepository<Moneda> contactRepo)
        {
            _contactRepo = contactRepo;
        }
        public async Task<bool> Actualizar(Moneda model)
        {
            return await _contactRepo.Actualizar(model);
        }

        public async Task<bool> Eliminar(int id)
        {
            return await _contactRepo.Eliminar(id);
        }

        public async Task<bool> Insertar(Moneda model)
        {
            return await _contactRepo.Insertar(model);
        }

        public async Task<Moneda> Obtener(int id)
        {
            return await _contactRepo.Obtener(id);
        }


        public async Task<IQueryable<Moneda>> ObtenerTodos()
        {
            return await _contactRepo.ObtenerTodos();
        }



    }
}

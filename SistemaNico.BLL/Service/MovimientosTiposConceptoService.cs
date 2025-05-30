using SistemaNico.DAL.Repository;
using SistemaNico.Models;

namespace SistemaNico.BLL.Service
{
    public class MovimientosTiposConceptoService : IMovimientosTiposConceptoService
    {

        private readonly IMovimientosTiposConceptoRepository<MovimientosTiposConcepto> _contactRepo;

        public MovimientosTiposConceptoService(IMovimientosTiposConceptoRepository<MovimientosTiposConcepto> contactRepo)
        {
            _contactRepo = contactRepo;
        }
        public async Task<bool> Actualizar(MovimientosTiposConcepto model)
        {
            return await _contactRepo.Actualizar(model);
        }

        public async Task<bool> Eliminar(int id)
        {
            return await _contactRepo.Eliminar(id);
        }

        public async Task<bool> Insertar(MovimientosTiposConcepto model)
        {
            return await _contactRepo.Insertar(model);
        }

        public async Task<MovimientosTiposConcepto> Obtener(int id)
        {
            return await _contactRepo.Obtener(id);
        }


        public async Task<IQueryable<MovimientosTiposConcepto>> ObtenerTodos()
        {
            return await _contactRepo.ObtenerTodos();
        }



    }
}

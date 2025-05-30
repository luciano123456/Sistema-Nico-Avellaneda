using SistemaNico.Models;

namespace SistemaNico.BLL.Service
{
    public interface IMovimientosTiposConceptoService
    {
        Task<bool> Eliminar(int id);
        Task<bool> Actualizar(MovimientosTiposConcepto model);
        Task<bool> Insertar(MovimientosTiposConcepto model);

        Task<MovimientosTiposConcepto> Obtener(int id);

        Task<IQueryable<MovimientosTiposConcepto>> ObtenerTodos();
    }

}

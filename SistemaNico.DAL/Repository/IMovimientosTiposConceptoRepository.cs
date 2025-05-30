using SistemaNico.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace SistemaNico.DAL.Repository
{
    public interface IMovimientosTiposConceptoRepository<TEntityModel> where TEntityModel : class
    {
        Task<bool> Eliminar(int id);
        Task<bool> Actualizar(MovimientosTiposConcepto model);
        Task<bool> Insertar(MovimientosTiposConcepto model);
        Task<MovimientosTiposConcepto> Obtener(int id);
        Task<IQueryable<MovimientosTiposConcepto>> ObtenerTodos();
    }
}

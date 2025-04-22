using SistemaNico.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace SistemaNico.DAL.Repository
{
    public interface IOperacionesRepository<TEntityModel> where TEntityModel : class
    {
        Task<bool> Eliminar(int id);
        Task<bool> Actualizar(Operaciones model);
        Task<bool> Insertar(Operaciones model);
        Task<Operaciones> Obtener(int id);
        Task<IQueryable<Operaciones>> ObtenerTodos(DateTime FechaDesde, DateTime FechaHasta, int IdTipoOperacion, int IdPuntoVenta, int IdUsuario);
        Task<IQueryable<OperacionesTipo>> ObtenerTipos();
    }
}

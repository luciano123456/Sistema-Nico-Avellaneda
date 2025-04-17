using SistemaNico.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace SistemaNico.DAL.Repository
{
    public interface IPuntosDeVentaRepository<TEntityModel> where TEntityModel : class
    {
        Task<bool> Eliminar(int id);
        Task<bool> Actualizar(PuntosDeVenta model);
        Task<bool> Insertar(PuntosDeVenta model);
        Task<PuntosDeVenta> Obtener(int id);
        Task<IQueryable<PuntosDeVenta>> ObtenerTodos();
    }
}

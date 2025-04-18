using SistemaNico.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace SistemaNico.DAL.Repository
{
    public interface IMonedasRepository<TEntityModel> where TEntityModel : class
    {
        Task<bool> Eliminar(int id);
        Task<bool> Actualizar(Moneda model);
        Task<bool> Insertar(Moneda model);
        Task<Moneda> Obtener(int id);
        Task<IQueryable<Moneda>> ObtenerTodos();
    }
}

using SistemaNico.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace SistemaNico.DAL.Repository
{
    public interface ICuentasRepository<TEntityModel> where TEntityModel : class
    {
        Task<bool> Eliminar(int id);
        Task<bool> Actualizar(Cuenta model);
        Task<bool> Insertar(Cuenta model);
        Task<Cuenta> Obtener(int id);
        Task<IQueryable<Cuenta>> ObtenerTodos();
        Task<IQueryable<Cuenta>> ObtenerActivos();
    }
}

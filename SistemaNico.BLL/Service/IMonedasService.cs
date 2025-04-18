using SistemaNico.Models;

namespace SistemaNico.BLL.Service
{
    public interface IMonedasService
    {
        Task<bool> Eliminar(int id);
        Task<bool> Actualizar(Moneda model);
        Task<bool> Insertar(Moneda model);

        Task<Moneda> Obtener(int id);

        Task<IQueryable<Moneda>> ObtenerTodos();
    }

}

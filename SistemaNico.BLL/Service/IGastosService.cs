using SistemaNico.Models;

namespace SistemaNico.BLL.Service
{
    public interface IGastosService
    {
        Task<bool> Eliminar(int id);
        Task<bool> Actualizar(Gasto model);
        Task<bool> Insertar(Gasto model);

        Task<Gasto> Obtener(int id);
        Task<IQueryable<Gasto>> ObtenerTodos(DateTime FechaDesde, DateTime FechaHasta, int IdPuntoVenta, int IdUsuario, int IdTipoGasto);
    }

}

using SistemaNico.Models;

namespace SistemaNico.BLL.Service
{
    public interface IOperacionesService
    {
        Task<bool> Eliminar(int id);
        Task<bool> Actualizar(Operaciones model);
        Task<bool> Insertar(Operaciones model);

        Task<Operaciones> Obtener(int id);

        Task<IQueryable<Operaciones>> ObtenerTodos(DateTime FechaDesde, DateTime FechaHasta, int IdTipoOperacion, int IdPuntoVenta, int IdUsuario);
        Task<IQueryable<OperacionesTipo>> ObtenerTipos();
    }

}

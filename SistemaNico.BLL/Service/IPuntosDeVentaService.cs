using SistemaNico.Models;

namespace SistemaNico.BLL.Service
{
    public interface IPuntosDeVentaService
    {
        Task<bool> Eliminar(int id);
        Task<bool> Actualizar(PuntosDeVenta model);
        Task<bool> Insertar(PuntosDeVenta model);

        Task<PuntosDeVenta> Obtener(int id);
        Task<IQueryable<PuntosDeVenta>> ObtenerActivos();
        Task<IQueryable<PuntosDeVenta>> ObtenerTodos();
    }

}

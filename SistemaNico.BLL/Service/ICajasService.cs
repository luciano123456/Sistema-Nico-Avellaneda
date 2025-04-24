using SistemaNico.Models;

namespace SistemaNico.BLL.Service
{
    public interface ICajasService
    {
        Task<bool> Eliminar(int id);
        Task<bool> Actualizar(Caja model);
        Task<bool> Insertar(Caja model);
        Task<bool> InsertarTransferencia(List<Caja> cajas);
        Task<bool> InsertarMovimiento(Caja caja);
        Task<bool> ActualizarMovimiento(Caja caja);


        Task<Caja> Obtener(int id);

        Task<List<Caja>> ObtenerTodos(DateTime FechaDesde, DateTime FechaHasta, int IdPuntoVenta, int IdMoneda, int IdCuenta);
    }

}

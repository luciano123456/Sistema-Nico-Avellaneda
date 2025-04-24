using SistemaNico.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace SistemaNico.DAL.Repository
{
    public interface ICajasRepository<TEntityModel> where TEntityModel : class
    {
        Task<bool> Eliminar(int id);
        Task<bool> Actualizar(Caja model);
        Task<bool> Insertar(Caja model);
        Task<bool> InsertarTransferencia(List<Caja> model);
        Task<bool> InsertarMovimiento(Caja model);
        Task<bool> ActualizarMovimiento(Caja model);
        Task<Caja> Obtener(int id);
        Task<List<Caja>> ObtenerTodos(DateTime FechaDesde, DateTime FechaHasta, int IdPuntoVenta, int IdMoneda, int IdCuenta);
    }
}

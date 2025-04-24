using SistemaNico.DAL.Repository;
using SistemaNico.Models;

namespace SistemaNico.BLL.Service
{
    public class CajasService : ICajasService
    {

        private readonly ICajasRepository<Caja> _contactRepo;

        public CajasService(ICajasRepository<Caja> contactRepo)
        {
            _contactRepo = contactRepo;
        }
        public async Task<bool> Actualizar(Caja model)
        {
            return await _contactRepo.Actualizar(model);
        }

        public async Task<bool> Eliminar(int id)
        {
            return await _contactRepo.Eliminar(id);
        }

        public async Task<bool> Insertar(Caja model)
        {
            return await _contactRepo.Insertar(model);
        }

        public async Task<bool> InsertarTransferencia(List<Caja> model)
        {
            return await _contactRepo.InsertarTransferencia(model);
        }

        public async Task<bool> InsertarMovimiento(Caja model)
        {
            return await _contactRepo.InsertarMovimiento(model);
        }

        public async Task<bool> ActualizarMovimiento(Caja model)
        {
            return await _contactRepo.ActualizarMovimiento(model);
        }

        public async Task<Caja> Obtener(int id)
        {
            return await _contactRepo.Obtener(id);
        }


        public async Task<List<Caja>> ObtenerTodos(DateTime FechaDesde, DateTime FechaHasta, int IdPuntoVenta, int IdMoneda, int IdCuenta)
        {
            return await _contactRepo.ObtenerTodos(FechaDesde, FechaHasta, IdPuntoVenta, IdMoneda, IdCuenta);
        }




    }
}

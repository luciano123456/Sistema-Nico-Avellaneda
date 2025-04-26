using Microsoft.EntityFrameworkCore;
using SistemaNico.DAL.DataContext;
using SistemaNico.Models;
using System;
using System.Collections.Generic;
using System.Diagnostics.Contracts;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace SistemaNico.DAL.Repository
{
    public class CajasRepository : ICajasRepository<Caja>
    {

        private readonly SistemaNicoContext _dbcontext;

        public CajasRepository(SistemaNicoContext context)
        {
            _dbcontext = context;
        }
        public async Task<bool> Actualizar(Caja model)
        {
            _dbcontext.Cajas.Update(model);
            await _dbcontext.SaveChangesAsync();
            return true;
        }

        public async Task<bool> Eliminar(int id)
        {
            using var transaction = await _dbcontext.Database.BeginTransactionAsync();

            try
            {
                var model = await _dbcontext.Cajas.FirstOrDefaultAsync(c => c.Id == id);
                if (model == null) throw new Exception("Caja no encontrada.");

                _dbcontext.Cajas.Remove(model);
                await _dbcontext.SaveChangesAsync();

                await transaction.CommitAsync();
                return true;
            }
            catch (Exception)
            {
                await transaction.RollbackAsync();
                return false;
            }
        }


        public async Task<bool> Insertar(Caja model)
        {
            _dbcontext.Cajas.Add(model);
            await _dbcontext.SaveChangesAsync();
            return true;
        }

        public async Task<bool> InsertarTransferencia(List<Caja> cajas)
        {
            using var trans = await _dbcontext.Database.BeginTransactionAsync();    

            try
            {
                _dbcontext.Cajas.AddRange(cajas);
                await _dbcontext.SaveChangesAsync();
                await trans.CommitAsync();
                return true;
            }
            catch
            {
                await trans.RollbackAsync();
                return false;
            }
        }

        public async Task<bool> InsertarMovimiento(Caja caja)
        {
            using var trans = await _dbcontext.Database.BeginTransactionAsync();

            try
            {
                _dbcontext.Cajas.Add(caja);
                await _dbcontext.SaveChangesAsync();
                await trans.CommitAsync();
                return true;
            }
            catch
            {
                await trans.RollbackAsync();
                return false;
            }
        }

        public async Task<bool> ActualizarMovimiento(Caja caja)
        {
            using var trans = await _dbcontext.Database.BeginTransactionAsync();

            try
            {
                var existente = await _dbcontext.Cajas.FirstOrDefaultAsync(x => x.Id == caja.Id);

                if (existente == null)
                    return false;

                existente.Fecha = caja.Fecha;
                existente.IdMoneda = caja.IdMoneda;
                existente.Egreso = caja.Egreso;
                existente.Ingreso = caja.Ingreso;
                existente.Concepto = caja.Concepto;
                existente.IdCuenta = caja.IdCuenta;
                existente.IdUsuario = caja.IdUsuario;
                existente.IdTipo = caja.IdTipo;
                existente.IdPuntoVenta = caja.IdPuntoVenta;

                _dbcontext.Cajas.Update(existente);
                await _dbcontext.SaveChangesAsync();
                await trans.CommitAsync();

                return true;
            }
            catch
            {
                await trans.RollbackAsync();
                return false;
            }
        }


        public async Task<Caja> Obtener(int id)
        {
            Caja model = await _dbcontext.Cajas.FindAsync(id);
            return model;
        }

        public async Task<List<Caja>> ObtenerTodos(DateTime FechaDesde, DateTime FechaHasta, int IdPuntoVenta, int IdMoneda, int IdCuenta)
        {
            DateTime fechaHastaExclusiva = FechaHasta.Date.AddDays(1);

            var query = _dbcontext.Cajas
                .Include(x => x.IdPuntoVentaNavigation)
                .Include(x => x.IdMonedaNavigation)
                .Include(x => x.IdUsuarioNavigation)
                .Include(x => x.IdCuentaNavigation)
                .Where(x => x.Fecha >= FechaDesde.Date && x.Fecha < fechaHastaExclusiva);

            if (IdPuntoVenta != -1)
                query = query.Where(x => x.IdPuntoVenta == IdPuntoVenta); // este solo es opcional

            if (IdMoneda != -2)
                query = query.Where(x => x.IdMoneda == IdMoneda);

            if (IdCuenta != -1)
                query = query.Where(x => x.IdCuenta == IdCuenta);

            return await query.ToListAsync();
        }






    }
}

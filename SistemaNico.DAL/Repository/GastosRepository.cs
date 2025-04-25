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
    public class GastosRepository : IGastosRepository<Gasto>
    {

        private readonly SistemaNicoContext _dbcontext;

        public GastosRepository(SistemaNicoContext context)
        {
            _dbcontext = context;
        }

        public async Task<bool> Insertar(Gasto model)
        {
            using var transaction = await _dbcontext.Database.BeginTransactionAsync();

            try
            {
                var caja = new Caja
                {
                    Fecha = model.Fecha,
                    IdUsuario = model.IdUsuario,
                    IdPuntoVenta = model.IdPuntoVenta,
                    IdTipo = 2, // suponiendo 2 = Gasto, podés hacer un enum o constante
                    Tipo = "Gasto",
                    IdMoneda = model.IdMoneda,
                    IdCuenta = model.IdCuenta,
                    Concepto = model.Concepto,
                    Ingreso = 0,
                    Egreso = model.Importe
                };

                _dbcontext.Cajas.Add(caja);
                await _dbcontext.SaveChangesAsync();

                model.IdCajaAsociado = caja.Id;

                _dbcontext.Gastos.Add(model);
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


        public async Task<bool> Actualizar(Gasto model)
        {
            using var transaction = await _dbcontext.Database.BeginTransactionAsync();

            try
            {

                _dbcontext.Gastos.Update(model);

                if (model.IdCajaAsociado > 0)
                {
                    var caja = await _dbcontext.Cajas.FindAsync(model.IdCajaAsociado);
                    if (caja != null)
                    {
                        caja.Fecha = model.Fecha;
                        caja.IdPuntoVenta = model.IdPuntoVenta;
                        caja.IdCuenta = model.IdCuenta;
                        caja.IdMoneda = model.IdMoneda;
                        caja.Egreso = model.Importe;
                        caja.Concepto = model.Concepto;

                        _dbcontext.Cajas.Update(caja);
                    }
                }

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


        public async Task<bool> Eliminar(int id)
        {
            using var transaction = await _dbcontext.Database.BeginTransactionAsync();

            try
            {
                // Buscar el gasto
                var gasto = await _dbcontext.Gastos.FirstOrDefaultAsync(g => g.Id == id);
                if (gasto == null) throw new Exception("Gasto no encontrado.");

                // Buscar la caja asociada
                if (gasto.IdCajaAsociado > 0)
                {
                    var caja = await _dbcontext.Cajas.FirstOrDefaultAsync(c => c.Id == gasto.IdCajaAsociado);
                    if (caja != null)
                        _dbcontext.Cajas.Remove(caja);
                }

                // Eliminar el gasto
                _dbcontext.Gastos.Remove(gasto);

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




        public async Task<Gasto> Obtener(int id)
        {
            try
            {
                Gasto model = await _dbcontext.Gastos.FindAsync(id);
                return model;
            }
            catch (Exception ex)
            {
                return null;
            }
        }


        public async Task<IQueryable<Gasto>> ObtenerTodos(DateTime FechaDesde, DateTime FechaHasta, int IdPuntoVenta, int IdUsuario)
        {
            // Agregamos 1 día a FechaHasta para incluir el día completo
            DateTime fechaHastaExclusiva = FechaHasta.Date.AddDays(1);

            IQueryable<Gasto> query = _dbcontext.Gastos
                    .Include(c => c.IdMonedaNavigation)
                    .Include(c => c.IdCuentaNavigation)
                    .Include(c => c.IdPuntoVentaNavigation)
                    .Include(c => c.IdUsuarioNavigation)
                .Where(x => x.Fecha >= FechaDesde.Date && x.Fecha < fechaHastaExclusiva);

            if (IdPuntoVenta != -1)
                query = query.Where(x => x.IdPuntoVenta == IdPuntoVenta);

            if (IdUsuario != -1)
                query = query.Where(x => x.IdUsuario == IdUsuario);

            return await Task.FromResult(query);
        }

    }
}

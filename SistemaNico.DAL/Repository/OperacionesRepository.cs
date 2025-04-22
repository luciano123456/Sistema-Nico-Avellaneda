using Microsoft.EntityFrameworkCore;
using SistemaNico.DAL.DataContext;
using SistemaNico.Models;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Diagnostics.Contracts;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace SistemaNico.DAL.Repository
{
    public class OperacionesRepository : IOperacionesRepository<Operaciones>
    {

        private readonly SistemaNicoContext _dbcontext;

        public OperacionesRepository(SistemaNicoContext context)
        {
            _dbcontext = context;
        }
        public async Task<bool> Actualizar(Operaciones model)
        {
            using var trans = await _dbcontext.Database.BeginTransactionAsync();

            try
            {
                // Obtener cajas relacionadas
                var cajaEgreso = await _dbcontext.Cajas.FindAsync(model.IdCajaEgreso);
                var cajaIngreso = await _dbcontext.Cajas.FindAsync(model.IdCajaIngreso);

                if (cajaEgreso == null || cajaIngreso == null)
                    throw new Exception("Cajas asociadas no encontradas.");

                // Actualizar caja egreso
                cajaEgreso.Fecha = model.Fecha;
                cajaEgreso.IdUsuario = model.IdUsuario;
                cajaEgreso.IdPuntoVenta = model.IdPuntoVenta;
                cajaEgreso.IdTipo = model.IdTipo;
                cajaEgreso.IdMoneda = model.IdMonedaEgreso;
                cajaEgreso.IdCuenta = model.IdCuentaEgreso;
                cajaEgreso.Concepto = model.NotaInterna;
                cajaEgreso.Egreso = model.ImporteEgreso;
                cajaEgreso.Ingreso = 0;

                // Actualizar caja ingreso
                cajaIngreso.Fecha = model.Fecha;
                cajaIngreso.IdUsuario = model.IdUsuario;
                cajaIngreso.IdPuntoVenta = model.IdPuntoVenta;
                cajaIngreso.IdTipo = model.IdTipo;
                cajaIngreso.IdMoneda = model.IdMonedaIngreso;
                cajaIngreso.IdCuenta = model.IdCuentaIngreso;
                cajaIngreso.Concepto = model.NotaInterna;
                cajaIngreso.Ingreso = model.ImporteIngreso;
                cajaIngreso.Egreso = 0;

                // Actualizar operación
                var operacion = await _dbcontext.Operaciones.FindAsync(model.Id);
                if (operacion == null)
                    throw new Exception("Operación no encontrada.");

                operacion.Fecha = model.Fecha;
                operacion.IdUsuario = model.IdUsuario;
                operacion.IdPuntoVenta = model.IdPuntoVenta;
                operacion.IdTipo = model.IdTipo;
                operacion.IdMonedaEgreso = model.IdMonedaEgreso;
                operacion.IdCuentaEgreso = model.IdCuentaEgreso;
                operacion.ImporteEgreso = model.ImporteEgreso;
                operacion.Cotizacion = model.Cotizacion;
                operacion.IdMonedaIngreso = model.IdMonedaIngreso;
                operacion.IdCuentaIngreso = model.IdCuentaIngreso;
                operacion.ImporteIngreso = model.ImporteIngreso;
                operacion.NotaInterna = model.NotaInterna;
                operacion.FechaActualizacion = model.FechaActualizacion;
                operacion.IdUsuarioActualizacion = model.IdUsuarioActualizacion;
                operacion.Cliente = model.Cliente;

                await _dbcontext.SaveChangesAsync();
                await trans.CommitAsync();
                return true;
            }
            catch (Exception)
            {
                await trans.RollbackAsync();
                return false;
            }
        }



        public async Task<bool> Eliminar(int idOperacion)
        {
            using var trans = await _dbcontext.Database.BeginTransactionAsync();

            try
            {
                var operacion = await _dbcontext.Operaciones.FindAsync(idOperacion);

                if (operacion == null)
                    return false;

                // Eliminar primero la operación (que tiene las FK)
                _dbcontext.Operaciones.Remove(operacion);
                await _dbcontext.SaveChangesAsync();

                // Ahora eliminar las cajas asociadas
                var cajaEgreso = await _dbcontext.Cajas.FindAsync(operacion.IdCajaEgreso);
                if (cajaEgreso != null) _dbcontext.Cajas.Remove(cajaEgreso);

                var cajaIngreso = await _dbcontext.Cajas.FindAsync(operacion.IdCajaIngreso);
                if (cajaIngreso != null) _dbcontext.Cajas.Remove(cajaIngreso);

                await _dbcontext.SaveChangesAsync();
                await trans.CommitAsync();

                return true;
            }
            catch (Exception ex)
            {
                await trans.RollbackAsync();
                return false;
            }
        }



        public async Task<bool> Insertar(Operaciones model)
        {
            using var trans = await _dbcontext.Database.BeginTransactionAsync();

            try
            {
                // Insertar Egreso
                var cajaEgreso = new Caja
                {
                    IdUsuario = model.IdUsuario,
                    IdPuntoVenta = model.IdPuntoVenta,
                    Fecha = model.Fecha,
                    IdTipo = model.IdTipo,
                    Tipo = "Egreso",
                    IdMoneda = model.IdMonedaEgreso,
                    IdCuenta = model.IdCuentaEgreso,
                    Concepto = model.NotaInterna,
                    Ingreso = 0,
                    Egreso = model.ImporteEgreso,
                    
                };

                _dbcontext.Cajas.Add(cajaEgreso);
                await _dbcontext.SaveChangesAsync();

                // Insertar Ingreso
                var cajaIngreso = new Caja
                {
                    IdUsuario = model.IdUsuario,
                    IdPuntoVenta = model.IdPuntoVenta,
                    Fecha = model.Fecha,
                    IdTipo = model.IdTipo,
                    Tipo = "Ingreso",
                    IdMoneda = model.IdMonedaIngreso,
                    IdCuenta = model.IdCuentaIngreso,
                    Concepto = model.NotaInterna,
                    Ingreso = model.ImporteIngreso,
                    Egreso = 0
                };

                _dbcontext.Cajas.Add(cajaIngreso);
                await _dbcontext.SaveChangesAsync();

                // Insertar operación con los IDs de cajas ya generados
                var operacion = new Operaciones
                {
                    Fecha = model.Fecha,
                    IdUsuario = model.IdUsuario,
                    IdPuntoVenta = model.IdPuntoVenta,
                    IdTipo = model.IdTipo,
                    IdMonedaEgreso = model.IdMonedaEgreso,
                    IdCuentaEgreso = model.IdCuentaEgreso,
                    ImporteEgreso = model.ImporteEgreso,
                    Cotizacion = model.Cotizacion,
                    IdMonedaIngreso = model.IdMonedaIngreso,
                    IdCuentaIngreso = model.IdCuentaIngreso,
                    ImporteIngreso = model.ImporteIngreso,
                    NotaInterna = model.NotaInterna,
                    IdCajaEgreso = cajaEgreso.Id,
                    IdCajaIngreso = cajaIngreso.Id,
                    Cliente = model.Cliente
                };

                _dbcontext.Operaciones.Add(operacion);
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


        public async Task<Operaciones> Obtener(int id)
        {
            Operaciones model = await _dbcontext.Operaciones
                .Include(x => x.IdUsuarioActualizacionNavigation)
                .Include(x => x.IdTipoNavigation)
                .Include(x => x.IdPuntoVentaNavigation)
                .Include(x => x.IdMonedaIngresoNavigation)
                .Include(x => x.IdCuentaIngresoNavigation)
                .Include(x => x.IdUsuarioNavigation)
                .Include(x => x.IdMonedaEgresoNavigation)
                .Include(x => x.IdCuentaEgresoNavigation)
                .FirstOrDefaultAsync(x => x.Id == id);
            return model;
        }

        public async Task<IQueryable<Operaciones>> ObtenerTodos(DateTime FechaDesde, DateTime FechaHasta, int IdTipoOperacion, int IdPuntoVenta, int IdUsuario)
        {
            // Agregamos 1 día a FechaHasta para incluir el día completo
            DateTime fechaHastaExclusiva = FechaHasta.Date.AddDays(1);

            IQueryable<Operaciones> query = _dbcontext.Operaciones
                .Where(x => x.Fecha >= FechaDesde.Date && x.Fecha < fechaHastaExclusiva);

            if (IdTipoOperacion != -1)
                query = query.Where(x => x.IdTipo == IdTipoOperacion);

            if (IdPuntoVenta != -1)
                query = query.Where(x => x.IdPuntoVenta == IdPuntoVenta);

            if (IdUsuario != -1)
                query = query.Where(x => x.IdUsuario == IdUsuario);

            return await Task.FromResult(query);
        }


        public async Task<IQueryable<OperacionesTipo>> ObtenerTipos()
        {
            IQueryable<OperacionesTipo> query = _dbcontext.OperacionesTipos;
            return await Task.FromResult(query);
        }




    }
}

using Microsoft.EntityFrameworkCore;
using SistemaNico.Models;
using System;
using System.Collections.Generic;
using System.Diagnostics.Contracts;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;
using SistemaNico.DAL.DataContext;

namespace SistemaNico.DAL.Repository
{
    public class CuentasRepository : ICuentasRepository<Cuenta>
    {

        private readonly SistemaNicoContext _dbcontext;

        public CuentasRepository(SistemaNicoContext context)
        {
            _dbcontext = context;
        }
        public async Task<bool> Actualizar(Cuenta model)
        {
            _dbcontext.Cuentas.Update(model);
            await _dbcontext.SaveChangesAsync();
            return true;
        }

        public async Task<bool> Eliminar(int id)
        {
            Cuenta model = _dbcontext.Cuentas.First(c => c.Id == id);
            _dbcontext.Cuentas.Remove(model);
            await _dbcontext.SaveChangesAsync();
            return true;
        }

        public async Task<bool> Insertar(Cuenta model)
        {
            try
            {
                _dbcontext.Cuentas.Add(model);
                await _dbcontext.SaveChangesAsync();
                return true;
            } catch (Exception ex)
            {
                return false;
            }
        }

        public async Task<Cuenta> Obtener(int id)
        {
            Cuenta model = await _dbcontext.Cuentas.FindAsync(id);
            return model;
        }
        public async Task<IQueryable<Cuenta>> ObtenerTodos()
        {
            IQueryable<Cuenta> query = _dbcontext.Cuentas
                .OrderByDescending(p => p.Activo); // primero los activos

            return await Task.FromResult(query);
        }

        public async Task<IQueryable<Cuenta>> ObtenerPorMoneda(int IdMoneda)
        {
            IQueryable<Cuenta> query = _dbcontext.Cuentas
                .Where(x => x.IdMoneda == IdMoneda && x.Activo == 1)
                .OrderByDescending(p => p.Activo); // primero los activos

            return await Task.FromResult(query);
        }

        public async Task<IQueryable<Cuenta>> ObtenerActivos()
        {
            IQueryable<Cuenta> query = _dbcontext.Cuentas
                .Where(x=> x.Activo == 1)
                .OrderByDescending(p => p.Activo); // primero los activos

            return await Task.FromResult(query);
        }





    }
}

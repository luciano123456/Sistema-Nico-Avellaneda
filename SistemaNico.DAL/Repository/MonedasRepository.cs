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
    public class MonedasRepository : IMonedasRepository<Moneda>
    {

        private readonly SistemaNicoContext _dbcontext;

        public MonedasRepository(SistemaNicoContext context)
        {
            _dbcontext = context;
        }
        public async Task<bool> Actualizar(Moneda model)
        {
            _dbcontext.Monedas.Update(model);
            await _dbcontext.SaveChangesAsync();
            return true;
        }

        public async Task<bool> Eliminar(int id)
        {
            Moneda model = _dbcontext.Monedas.First(c => c.Id == id);
            _dbcontext.Monedas.Remove(model);
            await _dbcontext.SaveChangesAsync();
            return true;
        }

        public async Task<bool> Insertar(Moneda model)
        {
            _dbcontext.Monedas.Add(model);
            await _dbcontext.SaveChangesAsync();
            return true;
        }

        public async Task<Moneda> Obtener(int id)
        {
            Moneda model = await _dbcontext.Monedas.FindAsync(id);
            return model;
        }
        public async Task<IQueryable<Moneda>> ObtenerTodos()
        {
            IQueryable<Moneda> query = _dbcontext.Monedas;
            return await Task.FromResult(query);
        }




    }
}

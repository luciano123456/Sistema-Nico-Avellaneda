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
    public class PuntosDeVentaRepository : IPuntosDeVentaRepository<PuntosDeVenta>
    {

        private readonly SistemaNicoContext _dbcontext;

        public PuntosDeVentaRepository(SistemaNicoContext context)
        {
            _dbcontext = context;
        }
        public async Task<bool> Actualizar(PuntosDeVenta model)
        {
            _dbcontext.PuntosDeVenta.Update(model);
            await _dbcontext.SaveChangesAsync();
            return true;
        }

        public async Task<bool> Eliminar(int id)
        {
            PuntosDeVenta model = _dbcontext.PuntosDeVenta.First(c => c.Id == id);
            _dbcontext.PuntosDeVenta.Remove(model);
            await _dbcontext.SaveChangesAsync();
            return true;
        }

        public async Task<bool> Insertar(PuntosDeVenta model)
        {
            _dbcontext.PuntosDeVenta.Add(model);
            await _dbcontext.SaveChangesAsync();
            return true;
        }

        public async Task<PuntosDeVenta> Obtener(int id)
        {
            PuntosDeVenta model = await _dbcontext.PuntosDeVenta.FindAsync(id);
            return model;
        }
        public async Task<IQueryable<PuntosDeVenta>> ObtenerTodos()
        {
            IQueryable<PuntosDeVenta> query = _dbcontext.PuntosDeVenta;
            return await Task.FromResult(query);
        }




    }
}

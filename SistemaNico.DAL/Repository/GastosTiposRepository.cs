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
    public class GastosTiposRepository : IGastosTiposRepository<GastosTipo>
    {

        private readonly SistemaNicoContext _dbcontext;

        public GastosTiposRepository(SistemaNicoContext context)
        {
            _dbcontext = context;
        }
        public async Task<bool> Actualizar(GastosTipo model)
        {
            _dbcontext.GastosTipos.Update(model);
            await _dbcontext.SaveChangesAsync();
            return true;
        }

        public async Task<bool> Eliminar(int id)
        {
            GastosTipo model = _dbcontext.GastosTipos.First(c => c.Id == id);
            _dbcontext.GastosTipos.Remove(model);
            await _dbcontext.SaveChangesAsync();
            return true;
        }

        public async Task<bool> Insertar(GastosTipo model)
        {
            _dbcontext.GastosTipos.Add(model);
            await _dbcontext.SaveChangesAsync();
            return true;
        }

        public async Task<GastosTipo> Obtener(int id)
        {
            GastosTipo model = await _dbcontext.GastosTipos.FindAsync(id);
            return model;
        }
        public async Task<IQueryable<GastosTipo>> ObtenerTodos()
        {
            IQueryable<GastosTipo> query = _dbcontext.GastosTipos;
            return await Task.FromResult(query);
        }




    }
}

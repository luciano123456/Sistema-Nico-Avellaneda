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
    public class MovimientosTiposConceptoRepository : IMovimientosTiposConceptoRepository<MovimientosTiposConcepto>
    {

        private readonly SistemaNicoContext _dbcontext;

        public MovimientosTiposConceptoRepository(SistemaNicoContext context)
        {
            _dbcontext = context;
        }
        public async Task<bool> Actualizar(MovimientosTiposConcepto model)
        {
            _dbcontext.MovimientosTiposConceptos.Update(model);
            await _dbcontext.SaveChangesAsync();
            return true;
        }

        public async Task<bool> Eliminar(int id)
        {
            MovimientosTiposConcepto model = _dbcontext.MovimientosTiposConceptos.First(c => c.Id == id);
            _dbcontext.MovimientosTiposConceptos.Remove(model);
            await _dbcontext.SaveChangesAsync();
            return true;
        }

        public async Task<bool> Insertar(MovimientosTiposConcepto model)
        {
            _dbcontext.MovimientosTiposConceptos.Add(model);
            await _dbcontext.SaveChangesAsync();
            return true;
        }

        public async Task<MovimientosTiposConcepto> Obtener(int id)
        {
            MovimientosTiposConcepto model = await _dbcontext.MovimientosTiposConceptos.FindAsync(id);
            return model;
        }
        public async Task<IQueryable<MovimientosTiposConcepto>> ObtenerTodos()
        {
            IQueryable<MovimientosTiposConcepto> query = _dbcontext.MovimientosTiposConceptos;
            return await Task.FromResult(query);
        }




    }
}

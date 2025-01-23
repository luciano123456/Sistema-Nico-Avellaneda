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
    public class ProvinciaRepository : IProvinciaRepository<Provincia>
    {

        private readonly SistemaNicoContext _dbcontext;

        public ProvinciaRepository(SistemaNicoContext context)
        {
            _dbcontext = context;
        }
       
        public async Task<IQueryable<Provincia>> ObtenerTodos()
        {
            IQueryable<Provincia> query = _dbcontext.Provincias;
            return query;
        }

  


    }
}

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
    public class RolesRepository : IRolesRepository<UsuariosRoles>
    {

        private readonly SistemaNicoContext _dbcontext;

        public RolesRepository(SistemaNicoContext context)
        {
            _dbcontext = context;
        }
        public async Task<bool> Actualizar(UsuariosRoles model)
        {
            _dbcontext.UsuariosRoles.Update(model);
            await _dbcontext.SaveChangesAsync();
            return true;
        }

        public async Task<bool> Eliminar(int id)
        {
            UsuariosRoles model = _dbcontext.UsuariosRoles.First(c => c.Id == id);
            _dbcontext.UsuariosRoles.Remove(model);
            await _dbcontext.SaveChangesAsync();
            return true;
        }

        public async Task<bool> Insertar(UsuariosRoles model)
        {
            _dbcontext.UsuariosRoles.Add(model);
            await _dbcontext.SaveChangesAsync();
            return true;
        }

        public async Task<UsuariosRoles> Obtener(int id)
        {
            UsuariosRoles model = await _dbcontext.UsuariosRoles.FindAsync(id);
            return model;
        }
        public async Task<IQueryable<UsuariosRoles>> ObtenerTodos()
        {
            IQueryable<UsuariosRoles> query = _dbcontext.UsuariosRoles;
            return await Task.FromResult(query);
        }




    }
}

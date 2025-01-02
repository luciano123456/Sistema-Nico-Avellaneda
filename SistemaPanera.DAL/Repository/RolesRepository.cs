﻿using Microsoft.EntityFrameworkCore;
using SistemaPanera.DAL.DataContext;
using SistemaPanera.Models;
using System;
using System.Collections.Generic;
using System.Diagnostics.Contracts;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace SistemaPanera.DAL.Repository
{
    public class RolesRepository : IRolesRepository<Rol>
    {

        private readonly SistemaPaneraContext _dbcontext;

        public RolesRepository(SistemaPaneraContext context)
        {
            _dbcontext = context;
        }
        public async Task<bool> Actualizar(Rol model)
        {
            _dbcontext.Roles.Update(model);
            await _dbcontext.SaveChangesAsync();
            return true;
        }

        public async Task<bool> Eliminar(int id)
        {
            Rol model = _dbcontext.Roles.First(c => c.Id == id);
            _dbcontext.Roles.Remove(model);
            await _dbcontext.SaveChangesAsync();
            return true;
        }

        public async Task<bool> Insertar(Rol model)
        {
            _dbcontext.Roles.Add(model);
            await _dbcontext.SaveChangesAsync();
            return true;
        }

        public async Task<Rol> Obtener(int id)
        {
            Rol model = await _dbcontext.Roles.FindAsync(id);
            return model;
        }
        public async Task<IQueryable<Rol>> ObtenerTodos()
        {
            IQueryable<Rol> query = _dbcontext.Roles;
            return await Task.FromResult(query);
        }




    }
}

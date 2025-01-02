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
    public class ColorRepository : IGenericRepository<Color>
    {

        private readonly SistemaPaneraContext _dbcontext;

        public ColorRepository(SistemaPaneraContext context)
        {
            _dbcontext = context;
        }
        public async Task<bool> Actualizar(Color model)
        {
            _dbcontext.Colores.Update(model);
            await _dbcontext.SaveChangesAsync();
            return true;
        }

        public async Task<bool> Eliminar(int id)
        {
            Color model = _dbcontext.Colores.First(c => c.Id == id);
            _dbcontext.Colores.Remove(model);
            await _dbcontext.SaveChangesAsync();
            return true;
        }

        public async Task<bool> Insertar(Color model)
        {
            _dbcontext.Colores.Add(model);
            await _dbcontext.SaveChangesAsync();
            return true;
        }

        public async Task<Color> Obtener(int id)
        {
            Color model = await _dbcontext.Colores.FindAsync(id);
            return model;
        }
        public async Task<IQueryable<Color>> ObtenerTodos()
        {
            IQueryable<Color> query = _dbcontext.Colores;
            return await Task.FromResult(query);
        }




    }
}

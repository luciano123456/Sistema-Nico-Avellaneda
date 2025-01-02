﻿using SistemaPanera.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace SistemaPanera.DAL.Repository
{
    public interface IEstadosUsuariosRepository<TEntityModel> where TEntityModel : class
    {
        Task<bool> Eliminar(int id);
        Task<bool> Actualizar(EstadosUsuario model);
        Task<bool> Insertar(EstadosUsuario model);
        Task<EstadosUsuario> Obtener(int id);
        Task<IQueryable<EstadosUsuario>> ObtenerTodos();
    }
}

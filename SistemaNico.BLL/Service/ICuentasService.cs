﻿using SistemaNico.Models;

namespace SistemaNico.BLL.Service
{
    public interface ICuentasService
    {
        Task<bool> Eliminar(int id);
        Task<bool> Actualizar(Cuenta model);
        Task<bool> Insertar(Cuenta model);

        Task<Cuenta> Obtener(int id);
        Task<IQueryable<Cuenta>> ObtenerActivos();
        Task<IQueryable<Cuenta>> ObtenerTodos();
    }

}

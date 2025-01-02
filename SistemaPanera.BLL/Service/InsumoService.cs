﻿using SistemaPanera.DAL.Repository;
using SistemaPanera.Models;

namespace SistemaPanera.BLL.Service
{
    public class Insumoservice : IInsumoService
    {

        private readonly IGenericRepository<Insumo> _contactRepo;

        public Insumoservice(IGenericRepository<Insumo> contactRepo)
        {
            _contactRepo = contactRepo;
        }
        public async Task<bool> Actualizar(Insumo model)
        {
            return await _contactRepo.Actualizar(model);
        }

        public async Task<bool> Eliminar(int id)
        {
            return await _contactRepo.Eliminar(id);
        }

        public async Task<bool> Insertar(Insumo model)
        {
            return await _contactRepo.Insertar(model);
        }

        public async Task<Insumo> Obtener(int id)
        {
            return await _contactRepo.Obtener(id);
        }


        public async Task<IQueryable<Insumo>> ObtenerTodos()
        {
            return await _contactRepo.ObtenerTodos();
        }



    }
}

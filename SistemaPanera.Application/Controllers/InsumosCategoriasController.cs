﻿using Microsoft.AspNetCore.Mvc;
using SistemaPanera.Application.Models;
using SistemaPanera.Application.Models.ViewModels;
using SistemaPanera.BLL.Service;
using SistemaPanera.Models;
using Microsoft.AspNetCore.Authorization;
using System.Diagnostics;

namespace SistemaPanera.Application.Controllers
{

    [Authorize]

    public class InsumosCategoriasController : Controller
    {
        private readonly IInsumoCategoriaService _Categoriaservice;

        public InsumosCategoriasController(IInsumoCategoriaService Categoriaservice)
        {
            _Categoriaservice = Categoriaservice;
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public async Task<IActionResult> Lista()
        {
            var Categorias = await _Categoriaservice.ObtenerTodos();

            var lista = Categorias.Select(c => new VMInsumoCategoria
            {
                Id = c.Id,
                Nombre = c.Nombre,
            
            }).ToList();

            return Ok(lista);
        }


        [HttpPost]
        public async Task<IActionResult> Insertar([FromBody] VMInsumoCategoria model)
        {
            var Categoria = new InsumosCategoria
            {
                Id = model.Id,
                Nombre = model.Nombre,
            };

            bool respuesta = await _Categoriaservice.Insertar(Categoria);

            return Ok(new { valor = respuesta });
        }

        [HttpPut]
        public async Task<IActionResult> Actualizar([FromBody] VMInsumoCategoria model)
        {
            var Categoria = new InsumosCategoria
            {
                Id = model.Id,
                Nombre = model.Nombre,
            };

            bool respuesta = await _Categoriaservice.Actualizar(Categoria);

            return Ok(new { valor = respuesta });
        }

        [HttpDelete]
        public async Task<IActionResult> Eliminar(int id)
        {
            bool respuesta = await _Categoriaservice.Eliminar(id);

            return StatusCode(StatusCodes.Status200OK, new { valor = respuesta });
        }

        [HttpGet]
        public async Task<IActionResult> EditarInfo(int id)
        {
            var Categoria = await _Categoriaservice.Obtener(id);

            if (Categoria != null)
            {
                return StatusCode(StatusCodes.Status200OK, Categoria);
            }
            else
            {
                return StatusCode(StatusCodes.Status404NotFound);
            }
        }
        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
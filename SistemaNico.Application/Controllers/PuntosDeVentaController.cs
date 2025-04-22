using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SistemaNico.Application.Models;
using SistemaNico.Application.Models.ViewModels;
using SistemaNico.BLL.Service;
using SistemaNico.Models;
using System.Diagnostics;

namespace SistemaNico.Application.Controllers
{
    [Authorize]
    public class PuntosDeVentaController : Controller
    {
        private readonly IPuntosDeVentaService _PuntosDeVentaService;

        public PuntosDeVentaController(IPuntosDeVentaService PuntosDeVentaService)
        {
            _PuntosDeVentaService = PuntosDeVentaService;
        }

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Login()
        {
            return View();
        }



        [HttpGet]
        public async Task<IActionResult> Lista()
        {
            var Roles = await _PuntosDeVentaService.ObtenerTodos();

            var lista = Roles.Select(c => new VMPuntosDeVenta
            {
                Id = c.Id,
                Nombre = c.Nombre,
                Activo = (int)c.Activo,
            }).ToList();

            return Ok(lista);
        }

        [HttpGet]
        public async Task<IActionResult> ListaActivos()
        {
            var Roles = await _PuntosDeVentaService.ObtenerActivos();

            var lista = Roles.Select(c => new VMPuntosDeVenta
            {
                Id = c.Id,
                Nombre = c.Nombre,
                Activo = (int)c.Activo,
            }).ToList();

            return Ok(lista);
        }



        [HttpPost]
        public async Task<IActionResult> Insertar([FromBody] VMPuntosDeVenta model)
        {
            var lista = new PuntosDeVenta
            {
                Id = model.Id,
                Nombre = model.Nombre,
                Activo = model.Activo,
            };

            bool respuesta = await _PuntosDeVentaService.Insertar(lista);

            return Ok(new { valor = respuesta });
        }

        [HttpPut]
        public async Task<IActionResult> Actualizar([FromBody] VMPuntosDeVenta model)
        {
            var Rol = new PuntosDeVenta
            {
                Id = model.Id,
                Nombre = model.Nombre,
                Activo = model.Activo,
            };

            bool respuesta = await _PuntosDeVentaService.Actualizar(Rol);

            return Ok(new { valor = respuesta });
        }

        [HttpDelete]
        public async Task<IActionResult> Eliminar(int id)
        {
            bool respuesta = await _PuntosDeVentaService.Eliminar(id);

            return StatusCode(StatusCodes.Status200OK, new { valor = respuesta });
        }

        [HttpGet]
        public async Task<IActionResult> EditarInfo(int id)
        {
             var respuesta = await _PuntosDeVentaService.Obtener(id);

            if (respuesta != null)
            {
                return StatusCode(StatusCodes.Status200OK, respuesta);
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
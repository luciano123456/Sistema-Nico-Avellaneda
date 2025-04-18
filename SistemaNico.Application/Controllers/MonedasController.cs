using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SistemaNico.Application.Models;
using SistemaNico.Application.Models.ViewModels;
using SistemaNico.BLL.Service;
using SistemaNico.Models;
using System.Diagnostics;

namespace SistemaNico.Application.ContMonedalers
{
    [Authorize]
    public class MonedasController : Controller
    {
        private readonly IMonedasService _MonedasService;

        public MonedasController(IMonedasService MonedasService)
        {
            _MonedasService = MonedasService;
        }

        [HttpGet]
        public async Task<IActionResult> Lista()
        {
            var Monedas = await _MonedasService.ObtenerTodos();

            var lista = Monedas.Select(c => new VMMonedas
            {
                Id = c.Id,
                Nombre = c.Nombre,
            }).ToList();

            return Ok(lista);
        }


        [HttpPost]
        public async Task<IActionResult> Insertar([FromBody] VMMonedas model)
        {
            var Moneda = new Moneda
            {
                Id = model.Id,
                Nombre = model.Nombre,
            };

            bool respuesta = await _MonedasService.Insertar(Moneda);

            return Ok(new { valor = respuesta });
        }

        [HttpPut]
        public async Task<IActionResult> Actualizar([FromBody] VMMonedas model)
        {
            var Moneda = new Moneda
            {
                Id = model.Id,
                Nombre = model.Nombre,
            };

            bool respuesta = await _MonedasService.Actualizar(Moneda);

            return Ok(new { valor = respuesta });
        }

        [HttpDelete]
        public async Task<IActionResult> Eliminar(int id)
        {
            bool respuesta = await _MonedasService.Eliminar(id);

            return StatusCode(StatusCodes.Status200OK, new { valor = respuesta });
        }

        [HttpGet]
        public async Task<IActionResult> EditarInfo(int id)
        {
             var Moneda = await _MonedasService.Obtener(id);

            if (Moneda != null)
            {
                return StatusCode(StatusCodes.Status200OK, Moneda);
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
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
    public class MovimientosTiposConceptoController : Controller
    {
        private readonly IMovimientosTiposConceptoService _MovimientosTiposConceptoService;

        public MovimientosTiposConceptoController(IMovimientosTiposConceptoService MovimientosTiposConceptoService)
        {
            _MovimientosTiposConceptoService = MovimientosTiposConceptoService;
        }

        [HttpGet]
        public async Task<IActionResult> Lista()
        {
            var MovimientosTiposConcepto = await _MovimientosTiposConceptoService.ObtenerTodos();

            var lista = MovimientosTiposConcepto.Select(c => new VMMovimientosTiposConcepto
            {
                Id = c.Id,
                Nombre = c.Nombre,
            }).ToList();

            return Ok(lista);
        }


        [HttpPost]
        public async Task<IActionResult> Insertar([FromBody] VMMovimientosTiposConcepto model)
        {
            var modelo = new MovimientosTiposConcepto
            {
                Id = model.Id,
                Nombre = model.Nombre,
            };

            bool respuesta = await _MovimientosTiposConceptoService.Insertar(modelo);

            return Ok(new { valor = respuesta });
        }

        [HttpPut]
        public async Task<IActionResult> Actualizar([FromBody] VMMovimientosTiposConcepto model)
        {
            var modelo = new MovimientosTiposConcepto
            {
                Id = model.Id,
                Nombre = model.Nombre,
            };

            bool respuesta = await _MovimientosTiposConceptoService.Actualizar(modelo);

            return Ok(new { valor = respuesta });
        }

        [HttpDelete]
        public async Task<IActionResult> Eliminar(int id)
        {
            bool respuesta = await _MovimientosTiposConceptoService.Eliminar(id);

            return StatusCode(StatusCodes.Status200OK, new { valor = respuesta });
        }

        [HttpGet]
        public async Task<IActionResult> EditarInfo(int id)
        {
             var modelo = await _MovimientosTiposConceptoService.Obtener(id);

            if (modelo != null)
            {
                return StatusCode(StatusCodes.Status200OK, modelo);
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
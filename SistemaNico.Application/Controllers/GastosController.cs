using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using SistemaNico.Application.Models;
using SistemaNico.Application.Models.ViewModels;
using SistemaNico.BLL.Service;
using SistemaNico.Models;
using System.Diagnostics;

namespace SistemaNico.Application.Controllers
{
    [Authorize]
    public class GastosController : Controller
    {
        private readonly IGastosService _Gastoservice;
        private readonly SessionHelper _sessionHelper;  // Inyección de SessionHelper

        public GastosController(IGastosService Gastoservice)
        {
            _Gastoservice = Gastoservice;
        }

        public IActionResult Index()
        {
            return View();
        }


        [HttpGet]
        public async Task<IActionResult> Lista(DateTime FechaDesde, DateTime FechaHasta, int IdPuntoVenta, int IdUsuario, int IdTipoGasto)
        {
            var Gastos = await _Gastoservice.ObtenerTodos(FechaDesde, FechaHasta, IdPuntoVenta, IdUsuario, IdTipoGasto);

            var lista = Gastos.Select(c => new VMGastos
            {
                Id = c.Id,
                IdUsuario = c.IdUsuario,
                IdCuenta = c.IdCuenta,
                IdPuntoVenta = c.IdPuntoVenta,
                Concepto = c.Concepto,
                IdMoneda = c.IdMoneda,
                Fecha = c.Fecha,
                NotaInterna = c.NotaInterna,
                Importe = c.Importe,
                Usuario = c.IdUsuarioNavigation != null ? c.IdUsuarioNavigation.Nombre : "",
                Moneda = c.IdMonedaNavigation != null ? c.IdMonedaNavigation.Nombre : "",
                Cuenta = c.IdCuentaNavigation != null ? c.IdCuentaNavigation.Nombre : "",
                PuntoDeVenta = c.IdPuntoVentaNavigation != null ? c.IdPuntoVentaNavigation.Nombre : "",
                TipoGasto = c.IdTipoNavigation != null ? c.IdTipoNavigation.Nombre : ""
            }).ToList();

            return Ok(lista);
        }


        [HttpPost]
        public async Task<IActionResult> Insertar([FromBody] VMGastos model)
        {

            var Gasto = new Gasto
            {
                Id = model.Id,
                IdUsuario = model.IdUsuario,
                IdCuenta = model.IdCuenta,
                IdPuntoVenta = model.IdPuntoVenta,
                Concepto = model.Concepto,
                IdMoneda = model.IdMoneda,
                Fecha = model.Fecha,
                NotaInterna = model.NotaInterna,
                Importe = model.Importe,
                IdTipo = model.IdTipo
            };

            bool respuesta = await _Gastoservice.Insertar(Gasto);

            return Ok(new { valor = respuesta });
        }

        [HttpPut]
        public async Task<IActionResult> Actualizar([FromBody] VMGastos model)
        {
            var Gasto = new Gasto
            {
                Id = model.Id,
                IdUsuario = model.IdUsuario,
                IdCuenta = model.IdCuenta,
                IdPuntoVenta = model.IdPuntoVenta,
                Concepto = model.Concepto,
                IdMoneda = model.IdMoneda,
                Fecha = model.Fecha,
                NotaInterna = model.NotaInterna,
                Importe = model.Importe,
                IdCajaAsociado = model.IdCajaAsociado,
                IdTipo = model.IdTipo
            };

            // Realiza la actualización en la base de datos
            bool respuesta = await _Gastoservice.Actualizar(Gasto);

            return Ok(new { valor = respuesta ? "OK" : "Error" });
        }




        [HttpDelete]
        public async Task<IActionResult> Eliminar(int id)
        {
            bool respuesta = await _Gastoservice.Eliminar(id);

            return StatusCode(StatusCodes.Status200OK, new { valor = respuesta });
        }

        [HttpGet]
        public async Task<IActionResult> EditarInfo(int id)
        {
            var Gasto = await _Gastoservice.Obtener(id);

            if (Gasto != null)
            {
                return StatusCode(StatusCodes.Status200OK, Gasto);
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
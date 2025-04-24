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
    public class OperacionesController : Controller
    {
        private readonly IOperacionesService _OperacionesService;

        public OperacionesController(IOperacionesService OperacionesService)
        {
            _OperacionesService = OperacionesService;
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public async Task<IActionResult> Lista(DateTime FechaDesde, DateTime FechaHasta, int IdTipoOperacion, int IdPuntoVenta, int IdUsuario)
        {
            try
            {
                var Operaciones = await _OperacionesService.ObtenerTodos(FechaDesde, FechaHasta, IdTipoOperacion, IdPuntoVenta, IdUsuario);

            var lista = Operaciones.Select(c => new VMOperaciones
            {
                Id = c.Id,
                Cotizacion= c.Cotizacion,
                Fecha = c.Fecha,
                IdCajaEgreso = c.IdCajaEgreso,
                IdCajaIngreso = c.IdCajaIngreso,
                IdCuentaEgreso = c.IdCuentaEgreso,
                IdCuentaIngreso = c.IdCuentaIngreso,
                IdMonedaEgreso = c.IdMonedaEgreso,
                IdMonedaIngreso = c.IdMonedaIngreso,
                IdPuntoVenta = c.IdPuntoVenta,
                IdTipo = c.IdTipo,
                IdUsuario = c.IdUsuario,
                NotaInterna = c.NotaInterna,
                ImporteIngreso = c.ImporteIngreso,
                ImporteEgreso = c.ImporteEgreso,
                Cliente = c.Cliente,
                Usuario = c.IdUsuarioNavigation.Nombre != null ? c.IdUsuarioNavigation.Nombre : "",
                UsuarioActualizacion = c.IdUsuarioActualizacionNavigation.Nombre != null ? c.IdUsuarioActualizacionNavigation.Nombre : "",
                Tipo = c.IdTipoNavigation.Nombre != null ? c.IdTipoNavigation.Nombre : "",
                CuentaIngreso = c.IdCuentaIngresoNavigation != null ? c.IdCuentaIngresoNavigation.Nombre : "",
                CuentaEgreso = c.IdCuentaEgresoNavigation.Nombre != null ? c.IdCuentaEgresoNavigation.Nombre : "",
                PuntoDeVenta = c.IdPuntoVentaNavigation.Nombre != null ? c.IdPuntoVentaNavigation.Nombre : ""
            }).ToList();

            return Ok(lista);
            }
            catch (Exception ex)
            {
                return BadRequest("Ha ocurrido un error al mostrar la lista de operaciones");
            }
        }


        [HttpGet]
        public async Task<IActionResult> ListaTipos()
        {
            var Operaciones = await _OperacionesService.ObtenerTipos();

            var lista = Operaciones.Select(c => new VMOperacionesTipos
            {
                Id = c.Id,
                Nombre = c.Nombre
            }).ToList();

            return Ok(lista);
        }


        [HttpPost]
        public async Task<IActionResult> Insertar([FromBody] VMOperaciones model)
        {
            var Rol = new Operaciones
            {
                Id = model.Id,
                Cotizacion = model.Cotizacion,
                Fecha = model.Fecha,
                IdCuentaEgreso = model.IdCuentaEgreso,
                IdCuentaIngreso = model.IdCuentaIngreso,
                IdMonedaEgreso = model.IdMonedaEgreso,
                IdMonedaIngreso = model.IdMonedaIngreso,
                IdPuntoVenta = model.IdPuntoVenta,
                IdTipo = model.IdTipo,
                IdUsuario = model.IdUsuario,
                NotaInterna = model.NotaInterna,
                ImporteIngreso = model.ImporteIngreso,
                ImporteEgreso = model.ImporteEgreso,
                Cliente = model.Cliente,
            };

            bool respuesta = await _OperacionesService.Insertar(Rol);

            return Ok(new { valor = respuesta });
        }

        [HttpPut]
        public async Task<IActionResult> Actualizar([FromBody] VMOperaciones model)
        {
            // Obtener el usuario actual desde la sesión usando el helper inyectado
            var userSession = await SessionHelper.GetUsuarioSesion(HttpContext);

            var operacion = new Operaciones
            {
                Id = model.Id,
                Cotizacion = model.Cotizacion,
                Fecha = model.Fecha,
                IdCuentaEgreso = model.IdCuentaEgreso,
                IdCuentaIngreso = model.IdCuentaIngreso,
                IdCajaEgreso = model.IdCajaEgreso,
                IdCajaIngreso = model.IdCajaIngreso,
                IdMonedaEgreso = model.IdMonedaEgreso,
                IdMonedaIngreso = model.IdMonedaIngreso,
                IdPuntoVenta = model.IdPuntoVenta,
                IdTipo = model.IdTipo,
                IdUsuario = model.IdUsuario,
                NotaInterna = model.NotaInterna,
                ImporteIngreso = model.ImporteIngreso,
                ImporteEgreso = model.ImporteEgreso,
                Cliente = model.Cliente,
                IdUsuarioActualizacion = userSession.Id,
                FechaActualizacion = DateTime.Now
            };

            bool respuesta = await _OperacionesService.Actualizar(operacion);

            return Ok(new { valor = respuesta });
        }

        [HttpDelete]
        public async Task<IActionResult> Eliminar(int id)
        {
            bool respuesta = await _OperacionesService.Eliminar(id);

            return StatusCode(StatusCodes.Status200OK, new { valor = respuesta });
        }

        [HttpGet]
        public async Task<IActionResult> EditarInfo(int id)
        {
            try
            {
                var model = await _OperacionesService.Obtener(id);

                var operacion = new VMOperaciones
                {
                    Id = model.Id,
                    Cotizacion = model.Cotizacion,
                    Fecha = model.Fecha,
                    IdCuentaEgreso = model.IdCuentaEgreso,
                    IdCuentaIngreso = model.IdCuentaIngreso,
                    IdCajaEgreso = model.IdCajaEgreso,
                    IdCajaIngreso = model.IdCajaIngreso,
                    IdMonedaEgreso = model.IdMonedaEgreso,
                    IdMonedaIngreso = model.IdMonedaIngreso,
                    IdPuntoVenta = model.IdPuntoVenta,
                    IdTipo = model.IdTipo,
                    IdUsuario = model.IdUsuario,
                    NotaInterna = model.NotaInterna,
                    ImporteIngreso = model.ImporteIngreso,
                    ImporteEgreso = model.ImporteEgreso,
                    IdUsuarioActualizacion = model.IdUsuarioActualizacion != null ? (int)model.IdUsuarioActualizacion : 0,
                    FechaActualizacion = model.FechaActualizacion,
                    Cliente = model.Cliente,
                    Usuario = model.IdUsuarioNavigation != null ? model.IdUsuarioNavigation.Nombre : "",
                    UsuarioActualizacion = model.IdUsuarioActualizacionNavigation != null ? model.IdUsuarioActualizacionNavigation.Nombre : "",
                    Tipo = model.IdTipoNavigation != null ? model.IdTipoNavigation.Nombre : "",
                    CuentaIngreso = model.IdCuentaEgresoNavigation != null ? model.IdCuentaEgresoNavigation.Nombre : "",
                    PuntoDeVenta = model.IdPuntoVentaNavigation != null ? model.IdPuntoVentaNavigation.Nombre : ""
                };



                if (model != null)
                {
                    return StatusCode(StatusCodes.Status200OK, operacion);
                }
                else
                {
                    return StatusCode(StatusCodes.Status404NotFound);
                }
            } catch(Exception ex)
            {
                return StatusCode(StatusCodes.Status400BadRequest, null);
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
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
    public class CajasController : Controller
    {
        private readonly ICajasService _CajasService;

        public CajasController(ICajasService CajasService)
        {
            _CajasService = CajasService;
        }

        public IActionResult Index()
        {
                return View();
        }


        [HttpGet]
        public async Task<IActionResult> Lista(DateTime FechaDesde, DateTime FechaHasta, int IdPuntoVenta, int IdMoneda, int IdCuenta)
        {
            var movimientos = await _CajasService.ObtenerTodos(FechaDesde, FechaHasta, IdPuntoVenta, IdMoneda, IdCuenta);

            var lista = movimientos.Select(c => new VMCajas
            {
                Id = c.Id,
                Concepto = c.Concepto,
                Moneda = c.IdMonedaNavigation != null ? c.IdMonedaNavigation.Nombre : null,
                Usuario = c.IdUsuarioNavigation != null ? c.IdUsuarioNavigation.Nombre : null,
                PuntoDeVenta = c.IdPuntoVentaNavigation != null ? c.IdPuntoVentaNavigation.Nombre : null,
                Tipo = c.Tipo,
                Cuenta = c.IdCuentaNavigation != null ? c.IdCuentaNavigation.Nombre : null,
                Egreso = c.Egreso,
                Fecha = c.Fecha,
                IdCuenta = c.IdCuenta,
                IdMoneda = c.IdMoneda,
                IdPuntoVenta = c.IdPuntoVenta,
                Ingreso = c.Ingreso,
                IdUsuario = c.IdUsuario,
                IdTipo = c.IdTipo
               
            }).ToList();

            if (IdMoneda > 0 && IdCuenta > 0)
            {
                var fechaMinima = new DateTime(2000, 1, 1);
                decimal saldoAnterior = 0;

                var movimientosPrevios = await _CajasService.ObtenerTodos(fechaMinima, FechaDesde.AddDays(-1), IdPuntoVenta, IdMoneda, IdCuenta);

                // Sumamos solo si hay movimientos, pero si no hay también insertamos la fila
                if (movimientosPrevios != null && movimientosPrevios.Any())
                {
                    saldoAnterior = (decimal)movimientosPrevios.Sum(x => x.Ingreso - x.Egreso);
                }

                lista.Insert(0, new VMCajas
                {
                    Fecha = null, 
                    Concepto = "",
                    Tipo = $"Saldo anterior al {FechaDesde:dd/MM/yyyy}",
                    Ingreso = 0,
                    Egreso = 0,
                    Id = -1,
                    Cuenta = "",
                    Usuario = "",
                    PuntoDeVenta = "",
                    Moneda = "",
                    IdCuenta = IdCuenta,
                    IdMoneda = IdMoneda,
                    IdPuntoVenta = IdPuntoVenta,
                    IdUsuario = 0,
                    IdTipo = 0,
                    SaldoAnterior = saldoAnterior // 👈 siempre se pasa, incluso si es 0
                });
            }




            return Ok(lista);
        }


        [HttpPost]
        public async Task<IActionResult> InsertarTransferencia([FromBody] VMCajasTransferencia model)
        {
            var cajaEgreso = new Caja
            {
                Fecha = model.Fecha,
                IdMoneda = model.IdMoneda,
                Egreso = model.Importe,
                Ingreso = 0,
                Concepto = model.Concepto,
                IdCuenta = model.IdCuentaDesde,
                IdUsuario = model.IdUsuario,
                IdTipo = 2,
                IdPuntoVenta = model.IdPuntoVenta,
                Tipo = "Trans. entre cuentas"
            };

            var cajaIngreso = new Caja
            {
                Fecha = model.Fecha,
                IdMoneda = model.IdMoneda,
                Ingreso = model.Importe,
                Egreso = 0,
                Concepto = model.Concepto,
                IdCuenta = model.IdCuentaHasta,
                IdUsuario = model.IdUsuario,
                IdTipo = 1,
                IdPuntoVenta = model.IdPuntoVenta,
                Tipo = "Trans. entre cuentas"
            };

            var movimientos = new List<Caja> { cajaEgreso, cajaIngreso };

            bool respuesta = await _CajasService.InsertarTransferencia(movimientos);

            return Ok(new { valor = respuesta });
        }
        [HttpPost]
        public async Task<IActionResult> InsertarMovimiento([FromBody] VMCajasMovimiento model)
        {
            var movimiento = new Caja
            {
                Fecha = model.Fecha,
                IdMoneda = model.IdMoneda,
                Egreso = model.IdTipo == 2 ? model.Importe : 0,
                Ingreso = model.IdTipo == 1 ? model.Importe : 0,
                Concepto = model.Concepto,
                IdCuenta = model.IdCuenta,
                IdUsuario = model.IdUsuario,
                IdTipo = model.IdTipo,
                IdPuntoVenta = model.IdPuntoVenta,
                Tipo = "Usuario"
            };

            bool respuesta = await _CajasService.InsertarMovimiento(movimiento);

            return Ok(new { valor = respuesta });
        }


        [HttpPut]
        public async Task<IActionResult> ActualizarMovimiento([FromBody] VMCajasMovimiento model)
        {
            var movimiento = new Caja
            {
                Id = model.Id,
                Fecha = model.Fecha,
                IdMoneda = model.IdMoneda,
                Egreso = model.IdTipo == 2 ? model.Importe : 0,
                Ingreso = model.IdTipo == 1 ? model.Importe : 0,
                Concepto = model.Concepto,
                IdCuenta = model.IdCuenta,
                IdUsuario = model.IdUsuario,
                IdTipo = model.IdTipo,
                IdPuntoVenta = model.IdPuntoVenta,
                Tipo = "Usuario"
            };

            bool respuesta = await _CajasService.ActualizarMovimiento(movimiento);

            return Ok(new { valor = respuesta });
        }


        [HttpPost]
        public async Task<IActionResult> Insertar([FromBody] VMCajas model)
        {
            var caja = new Caja
            {
                Id = model.Id,
                Concepto = model.Concepto,
                Egreso = model.Egreso,
                Fecha = (DateTime)model.Fecha,
                IdCuenta = model.IdCuenta,
                IdMoneda = model.IdMoneda,
                IdTipo = model.IdTipo,
                IdPuntoVenta = model.IdPuntoVenta,
                IdUsuario = model.IdUsuario,
                Ingreso = model.Ingreso,
                Tipo = model.Tipo
            };

            bool respuesta = await _CajasService.Insertar(caja);

            return Ok(new { valor = respuesta });
        }

        [HttpPut]
        public async Task<IActionResult> Actualizar([FromBody] VMCajas model)
        {
            var caja = new Caja
            {
                Id = model.Id,
                Concepto = model.Concepto,
                Egreso = model.Egreso,
                Fecha = (DateTime)model.Fecha,
                IdCuenta = model.IdCuenta,
                IdMoneda = model.IdMoneda,
                IdTipo = model.IdTipo,
                IdPuntoVenta = model.IdPuntoVenta,
                IdUsuario = model.IdUsuario,
                Ingreso = model.Ingreso,
                Tipo = model.Tipo
            };

            bool respuesta = await _CajasService.Actualizar(caja);

            return Ok(new { valor = respuesta });
        }

        [HttpDelete]
        public async Task<IActionResult> Eliminar(int id)
        {
            bool respuesta = await _CajasService.Eliminar(id);

            return StatusCode(StatusCodes.Status200OK, new { valor = respuesta });
        }

        [HttpGet]
        public async Task<IActionResult> EditarInfo(int id)
        {
            var respuesta = await _CajasService.Obtener(id);

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
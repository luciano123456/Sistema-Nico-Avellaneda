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
    public class CuentasController : Controller
    {
        private readonly ICuentasService _CuentasService;

        public CuentasController(ICuentasService CuentasService)
        {
            _CuentasService = CuentasService;
        }

        public IActionResult Index()
        {
            var userSession = SessionHelper.GetUsuarioSesion(HttpContext);

            if (userSession.Result.IdRol != 1 && userSession.Result.IdRol != 3)
            {
                return RedirectToAction("Index", "AccesoDenegado");
            }
            else
            {
                return View();
            }
        }

        public IActionResult Login()
        {
            return View();
        }



        [HttpGet]
        public async Task<IActionResult> Lista()
        {
            var Roles = await _CuentasService.ObtenerTodos();

            var lista = Roles.Select(c => new VMCuentas
            {
                Id = c.Id,
                Nombre = c.Nombre,
                Activo = (int)c.Activo,
                IdMoneda = c.IdMoneda
            }).ToList();

            return Ok(lista);
        }

        [HttpGet]
        public async Task<IActionResult> ListaPorMoneda(int IdMoneda)
        {
            var Roles = await _CuentasService.ObtenerPorMoneda(IdMoneda);

            var lista = Roles.Select(c => new VMCuentas
            {
                Id = c.Id,
                Nombre = c.Nombre,
                Activo = (int)c.Activo,
                IdMoneda = c.IdMoneda
            }).ToList();

            return Ok(lista);
        }

        [HttpGet]
        public async Task<IActionResult> ListaPorMonedaOperacion(int IdMoneda)
        {
            var Roles = await _CuentasService.ObtenerPorMonedaOperacion(IdMoneda);

            var lista = Roles.Select(c => new VMCuentas
            {
                Id = c.Id,
                Nombre = c.Nombre,
                Activo = (int)c.Activo,
                IdMoneda = c.IdMoneda
            }).ToList();

            return Ok(lista);
        }



        [HttpGet]
        public async Task<IActionResult> ListaActivos()
        {
            var Roles = await _CuentasService.ObtenerActivos();

            var lista = Roles.Select(c => new VMCuentas
            {
                Id = c.Id,
                Nombre = c.Nombre,
                Activo = (int)c.Activo,
                IdMoneda = c.IdMoneda
            }).ToList();

            return Ok(lista);
        }



        [HttpPost]
        public async Task<IActionResult> Insertar([FromBody] VMCuentas model)
        {
            var lista = new Cuenta
            {
                Id = model.Id,
                Nombre = model.Nombre,
                Activo = model.Activo,
                IdMoneda = model.IdMoneda
            };

            bool respuesta = await _CuentasService.Insertar(lista);

            return Ok(new { valor = respuesta });
        }

        [HttpPut]
        public async Task<IActionResult> Actualizar([FromBody] VMCuentas model)
        {
            var Rol = new Cuenta
            {
                Id = model.Id,
                Nombre = model.Nombre,
                Activo = model.Activo,
                IdMoneda = model.IdMoneda
            };

            bool respuesta = await _CuentasService.Actualizar(Rol);

            return Ok(new { valor = respuesta });
        }

        [HttpDelete]
        public async Task<IActionResult> Eliminar(int id)
        {
            bool respuesta = await _CuentasService.Eliminar(id);

            return StatusCode(StatusCodes.Status200OK, new { valor = respuesta });
        }

        [HttpGet]
        public async Task<IActionResult> EditarInfo(int id)
        {
             var respuesta = await _CuentasService.Obtener(id);

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
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
    public class AccesoDenegadoController : Controller
    {
        public IActionResult Index()
        {
           
            return View();
        }

       
    }
}
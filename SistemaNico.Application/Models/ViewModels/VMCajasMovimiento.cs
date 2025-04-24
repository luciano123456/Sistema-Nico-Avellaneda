using SistemaNico.Models;

namespace SistemaNico.Application.Models.ViewModels
{
    public class VMCajasMovimiento
    {
        public int Id { get; set; }
        public int IdMoneda { get; set; }
        public decimal Importe { get; set; }
        public string Concepto { get; set; }
        public int IdCuenta { get; set; }
        public int IdTipo { get; set; }
        public int IdUsuario { get; set; }
        public int IdPuntoVenta { get; set; }
        public DateTime Fecha { get; set; }
    }
}

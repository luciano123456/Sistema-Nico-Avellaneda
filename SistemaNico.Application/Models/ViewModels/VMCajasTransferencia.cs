using SistemaNico.Models;

namespace SistemaNico.Application.Models.ViewModels
{
    public class VMCajasTransferencia
    {
        public int Id { get; set; }
        public int IdMoneda { get; set; }
        public decimal Importe { get; set; }
        public string Concepto { get; set; }
        public int IdCuentaDesde { get; set; }
        public int IdCuentaHasta { get; set; }
        public int IdUsuario { get; set; }
        public int IdPuntoVenta { get; set; }
        public string Notas { get; set; }
        public DateTime Fecha { get; set; }
    }
}

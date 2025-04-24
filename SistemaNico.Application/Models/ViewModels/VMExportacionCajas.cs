using SistemaNico.Models;

namespace SistemaNico.Application.Models.ViewModels
{
    public class VMExportacionCajas
    {
        public DateTime FechaDesde { get; set; }
        public DateTime FechaHasta { get; set; }
        public List<int> IdCuentas { get; set; }
    }

}

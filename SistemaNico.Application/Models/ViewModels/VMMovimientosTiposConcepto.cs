using SistemaNico.Models;

namespace SistemaNico.Application.Models.ViewModels
{
    public class VMMovimientosTiposConcepto
    {
        public int Id { get; set; }

        public string? Nombre { get; set; }

        public virtual ICollection<Caja> Cajas { get; set; } = new List<Caja>();
    }
}

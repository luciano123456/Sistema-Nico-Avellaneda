using SistemaNico.Models;

namespace SistemaNico.Application.Models.ViewModels
{
    public class VMGastosTipos
    {
        public int Id { get; set; }

        public string? Nombre { get; set; }

        public virtual ICollection<Gasto> Gastos { get; set; } = new List<Gasto>();
    }
}

using SistemaNico.Models;

namespace SistemaNico.Application.Models.ViewModels
{
    public class VMOperacionesTipos
    {
        public int Id { get; set; }

        public string Nombre { get; set; } = null!;

        public virtual ICollection<Operaciones> Operaciones { get; set; } = new List<Operaciones>();




    }
}

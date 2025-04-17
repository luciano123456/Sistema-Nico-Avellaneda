using System;
using System.Collections.Generic;

namespace SistemaNico.Models;

public partial class PuntosDeVenta
{
    public int Id { get; set; }

    public string Nombre { get; set; } = null!;
    public int Activo { get; set; }

    public virtual ICollection<Caja> Cajas { get; set; } = new List<Caja>();

    public virtual ICollection<Gasto> Gastos { get; set; } = new List<Gasto>();

    public virtual ICollection<Operaciones> Operaciones { get; set; } = new List<Operaciones>();
}

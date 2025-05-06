using System;
using System.Collections.Generic;

namespace SistemaNico.Models;

public partial class GastosTipo
{
    public int Id { get; set; }

    public string? Nombre { get; set; }

    public virtual ICollection<Gasto> Gastos { get; set; } = new List<Gasto>();
}

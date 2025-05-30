using System;
using System.Collections.Generic;

namespace SistemaNico.Models;

public partial class MovimientosTiposConcepto
{
    public int Id { get; set; }

    public string? Nombre { get; set; }

    public virtual ICollection<Caja> Cajas { get; set; } = new List<Caja>();
}

using System;
using System.Collections.Generic;

namespace SistemaNico.Models;

public partial class Modulo
{
    public int Id { get; set; }

    public string Nombre { get; set; } = null!;

    public virtual ICollection<ModulosFunciones> ModulosFunciones { get; set; } = new List<ModulosFunciones>();
}

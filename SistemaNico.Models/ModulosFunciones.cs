using System;
using System.Collections.Generic;

namespace SistemaNico.Models;

public partial class ModulosFunciones
{
    public int Id { get; set; }

    public string Descripcion { get; set; } = null!;

    public int IdModulo { get; set; }

    public virtual Modulo IdModuloNavigation { get; set; } = null!;
}

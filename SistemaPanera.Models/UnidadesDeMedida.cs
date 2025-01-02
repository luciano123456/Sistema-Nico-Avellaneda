﻿using System;
using System.Collections.Generic;

namespace SistemaPanera.Models;

public partial class UnidadesDeMedida
{
    public int Id { get; set; }

    public string Nombre { get; set; } = null!;

    public virtual ICollection<Insumo> Insumos { get; set; } = new List<Insumo>();
}

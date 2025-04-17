﻿using System;
using System.Collections.Generic;

namespace SistemaNico.Models;

public partial class UsuariosEstado
{
    public int Id { get; set; }

    public string Nombre { get; set; } = null!;

    public virtual ICollection<User> Usuarios { get; set; } = new List<User>();
}

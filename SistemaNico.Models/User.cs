using System;
using System.Collections.Generic;

namespace SistemaNico.Models;

public partial class User
{
    public int Id { get; set; }

    public string? Usuario { get; set; }

    public string? Nombre { get; set; }

    public string? Apellido { get; set; }

    public string? Dni { get; set; }

    public string? Telefono { get; set; }

    public string? Direccion { get; set; }

    public int IdRol { get; set; }

    public string Contrasena { get; set; } = null!;

    public int IdEstado { get; set; }

    public virtual ICollection<Caja> Cajas { get; set; } = new List<Caja>();

    public virtual ICollection<Gasto> Gastos { get; set; } = new List<Gasto>();

    public virtual UsuariosEstado IdEstadoNavigation { get; set; } = null!;

    public virtual UsuariosRoles IdRolNavigation { get; set; } = null!;

    public virtual ICollection<Operaciones> Operaciones { get; set; } = new List<Operaciones>();
}

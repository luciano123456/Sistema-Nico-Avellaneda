using System;
using System.Collections.Generic;

namespace SistemaNico.Models;

public partial class Cuenta
{
    public int Id { get; set; }

    public string Nombre { get; set; } = null!;

    public int IdMoneda { get; set; }

    public virtual ICollection<Caja> Cajas { get; set; } = new List<Caja>();

    public virtual ICollection<Gasto> Gastos { get; set; } = new List<Gasto>();

    public virtual Moneda IdMonedaNavigation { get; set; } = null!;

    public virtual ICollection<Operaciones> OperacioneIdCuentaEgresoNavigations { get; set; } = new List<Operaciones>();

    public virtual ICollection<Operaciones> OperacioneIdCuentaIngresoNavigations { get; set; } = new List<Operaciones>();
}

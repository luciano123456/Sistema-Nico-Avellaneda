﻿using SistemaNico.Models;

namespace SistemaNico.Application.Models.ViewModels
{
    public class VMMonedas
    {
        public int Id { get; set; }

        public string Nombre { get; set; } = null!;

        public virtual ICollection<Caja> Cajas { get; set; } = new List<Caja>();

        public virtual ICollection<Cuenta> Cuenta { get; set; } = new List<Cuenta>();

        public virtual ICollection<Gasto> Gastos { get; set; } = new List<Gasto>();

        public virtual ICollection<Operaciones> OperacioneIdMonedaEgresoNavigations { get; set; } = new List<Operaciones>();

        public virtual ICollection<Operaciones> OperacioneIdMonedaIngresoNavigations { get; set; } = new List<Operaciones>();

    }
}

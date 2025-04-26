using System;
using System.Collections.Generic;

namespace SistemaNico.Models;

public partial class Operaciones
{
    public int Id { get; set; }

    public int IdUsuario { get; set; }

    public int IdPuntoVenta { get; set; }

    public DateTime Fecha { get; set; }

    public int IdTipo { get; set; }

    public int IdMonedaIngreso { get; set; }

    public int IdCuentaIngreso { get; set; }

    public decimal ImporteIngreso { get; set; }

    public decimal Cotizacion { get; set; }

    public int IdMonedaEgreso { get; set; }

    public int IdCuentaEgreso { get; set; }
    public string? NumeroOperacion { get; set; }

    public decimal ImporteEgreso { get; set; }

    public string? NotaInterna { get; set; }
    public string? Cliente { get; set; }

    public int IdCajaEgreso { get; set; }

    public int IdCajaIngreso { get; set; }

    public int? IdUsuarioActualizacion { get; set; }

    public DateTime? FechaActualizacion { get; set; }

    public virtual Caja IdCajaEgresoNavigation { get; set; } = null!;

    public virtual Caja IdCajaIngresoNavigation { get; set; } = null!;

    public virtual Cuenta IdCuentaEgresoNavigation { get; set; } = null!;

    public virtual Cuenta IdCuentaIngresoNavigation { get; set; } = null!;

    public virtual Moneda IdMonedaEgresoNavigation { get; set; } = null!;

    public virtual Moneda IdMonedaIngresoNavigation { get; set; } = null!;

    public virtual PuntosDeVenta IdPuntoVentaNavigation { get; set; } = null!;

    public virtual OperacionesTipo IdTipoNavigation { get; set; } = null!;

    public virtual User? IdUsuarioActualizacionNavigation { get; set; }

    public virtual User IdUsuarioNavigation { get; set; } = null!;
}

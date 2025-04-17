using System;
using System.Collections.Generic;

namespace SistemaNico.Models;

public partial class Operaciones
{
    public int Id { get; set; }

    public int IdUsuario { get; set; }

    public int IdPuntoVenta { get; set; }

    public DateTime FechaHoraRegistro { get; set; }

    public DateTime Fecha { get; set; }

    public int IdTipo { get; set; }

    public int IdMonedaIngreso { get; set; }

    public int IdCuentaIngreso { get; set; }

    public decimal ImporteIngreso { get; set; }

    public decimal Cotizacion { get; set; }

    public decimal Conversion { get; set; }

    public int IdMonedaEgreso { get; set; }

    public int IdCuentaEgreso { get; set; }

    public decimal ImporteEgreso { get; set; }

    public string? NotaInterna { get; set; }

    public int IdCajaAsociado { get; set; }

    public virtual Caja IdCajaAsociadoNavigation { get; set; } = null!;

    public virtual Cuenta IdCuentaEgresoNavigation { get; set; } = null!;

    public virtual Cuenta IdCuentaIngresoNavigation { get; set; } = null!;

    public virtual Moneda IdMonedaEgresoNavigation { get; set; } = null!;

    public virtual Moneda IdMonedaIngresoNavigation { get; set; } = null!;

    public virtual PuntosDeVenta IdPuntoVentaNavigation { get; set; } = null!;

    public virtual OperacionesTipo IdTipoNavigation { get; set; } = null!;

    public virtual User IdUsuarioNavigation { get; set; } = null!;
}

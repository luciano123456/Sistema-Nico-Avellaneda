using System;
using System.Collections.Generic;

namespace SistemaNico.Models;

public partial class Gasto
{
    public int Id { get; set; }

    public int IdUsuario { get; set; }

    public int IdPuntoVenta { get; set; }

    public DateTime Fecha { get; set; }

    public int IdMoneda { get; set; }

    public int IdCuenta { get; set; }

    public string Concepto { get; set; } = null!;

    public decimal Importe { get; set; }

    public string? NotaInterna { get; set; }

    public int IdCajaAsociado { get; set; }

    public int? IdTipo { get; set; }

    public virtual Caja IdCajaAsociadoNavigation { get; set; } = null!;

    public virtual Cuenta IdCuentaNavigation { get; set; } = null!;

    public virtual Moneda IdMonedaNavigation { get; set; } = null!;

    public virtual PuntosDeVenta IdPuntoVentaNavigation { get; set; } = null!;

    public virtual GastosTipo? IdTipoNavigation { get; set; }

    public virtual User IdUsuarioNavigation { get; set; } = null!;
}

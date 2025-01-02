﻿using System;
using System.Collections.Generic;

namespace SistemaPanera.Models;

public partial class Cliente
{
    public int Id { get; set; }

    public string Nombre { get; set; } = null!;

    public string? Telefono { get; set; }

    public string? Direccion { get; set; }

    public int? IdProvincia { get; set; }

    public string? Localidad { get; set; }

    public string? Dni { get; set; }

    public decimal? Saldo { get; set; }

    public decimal? SaldoAfavor { get; set; }

    public virtual Provincia? IdProvinciaNavigation { get; set; }
}

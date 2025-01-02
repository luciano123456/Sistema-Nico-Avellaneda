﻿using SistemaPanera.Models;

namespace SistemaPanera.Application.Models.ViewModels
{
    public class VMChofer
    {
        public int Id { get; set; }

        public string Nombre { get; set; } = null!;

        public string? Telefono { get; set; }

        public string? Direccion { get; set; }

    }
}

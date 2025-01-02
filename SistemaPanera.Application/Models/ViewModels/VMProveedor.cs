﻿using SistemaPanera.Models;

namespace SistemaPanera.Application.Models.ViewModels
{
    public class VMProveedor
    {
        public int Id { get; set; }

        public string Nombre { get; set; } = null!;

        public string? Apodo { get; set; }

        public string? Ubicacion { get; set; }

        public string? Telefono { get; set; }

        public string? Cbu { get; set; }

        public string? Cuit { get; set; }

    }
}

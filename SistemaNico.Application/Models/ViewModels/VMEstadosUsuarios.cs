﻿using SistemaNico.Models;

namespace SistemaNico.Application.Models.ViewModels
{
    public class VMEstadosUsuarios
    {
        public int Id { get; set; }

        public string? Nombre { get; set; }

        public virtual ICollection<User> Usuarios { get; set; } = new List<User>();
    }
}

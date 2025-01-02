﻿using SistemaPanera.Models;

namespace SistemaPanera.Application.Models.ViewModels
{
    public class VMRoles
    {
        public int Id { get; set; }

        public string Nombre { get; set; } = null!;

        public virtual ICollection<User> Usuarios { get; set; } = new List<User>();

    }
}

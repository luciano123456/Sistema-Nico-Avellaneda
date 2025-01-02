﻿using SistemaPanera.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SistemaPanera.DAL.Repository
{
    public interface ILoginRepository<TEntityModel> where TEntityModel : class
    {
        Task<User> Login(string username, string password);

        Task<bool> Logout();
    }
}

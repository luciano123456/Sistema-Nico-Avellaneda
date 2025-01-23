using SistemaNico.Models;
using System.Net.Http;

namespace SistemaNico.BLL.Service
{
    public interface ILoginService
    {
        Task<User> Login(string username, string password);

        Task<bool> Logout();
    }
}

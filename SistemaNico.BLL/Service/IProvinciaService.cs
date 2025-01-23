using SistemaNico.Models;

namespace SistemaNico.BLL.Service
{
    public interface IProvinciaService
    {
        Task<IQueryable<Provincia>> ObtenerTodos();
    }
}

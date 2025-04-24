using SistemaNico.Models;

namespace SistemaNico.Application.Models.ViewModels
{
    public class VMCajas
    {
        public int Id { get; set; }

        public int IdUsuario { get; set; }

        public int IdPuntoVenta { get; set; }

        public DateTime? Fecha { get; set; }

        public int IdTipo { get; set; }

        public string? Tipo { get; set; }

        public int IdMoneda { get; set; }

        public int IdCuenta { get; set; }

        public string Concepto { get; set; } = null!;

        public decimal? Ingreso { get; set; }
        public decimal? SaldoAnterior { get; set; }

        public decimal Egreso { get; set; }
        public string Usuario { get; set; }
        public string PuntoDeVenta { get; set; }
        public string Moneda { get; set; }
        public string Cuenta { get; set; }


        public virtual Cuenta IdCuentaNavigation { get; set; } = null!;

        public virtual Moneda IdMonedaNavigation { get; set; } = null!;

        public virtual PuntosDeVenta IdPuntoVentaNavigation { get; set; } = null!;

        public virtual User IdUsuarioNavigation { get; set; } = null!;

        public virtual ICollection<Operaciones> OperacioneIdCajaEgresoNavigations { get; set; } = new List<Operaciones>();

        public virtual ICollection<Operaciones> OperacioneIdCajaIngresoNavigations { get; set; } = new List<Operaciones>();

    }
}

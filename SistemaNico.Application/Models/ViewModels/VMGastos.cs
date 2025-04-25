using SistemaNico.Models;

namespace SistemaNico.Application.Models.ViewModels
{
    public class VMGastos
    {
        public int Id { get; set; }

        public int IdUsuario { get; set; }

        public int IdPuntoVenta { get; set; }

        public DateTime Fecha { get; set; }

        public int IdMoneda { get; set; }

        public int IdCuenta { get; set; }
        public int IdCajaAsociado { get; set; }

        public string Concepto { get; set; } = null!;

        public decimal Importe { get; set; }

        public string? NotaInterna { get; set; }
        public string? Usuario { get; set; }
        public string? PuntoDeVenta { get; set; }
        public string? Moneda { get; set; }
        public string? Cuenta { get; set; }

        public virtual Cuenta IdCuentaNavigation { get; set; } = null!;

        public virtual Moneda IdMonedaNavigation { get; set; } = null!;

        public virtual PuntosDeVenta IdPuntoVentaNavigation { get; set; } = null!;

        public virtual User IdUsuarioNavigation { get; set; } = null!;


    }
}

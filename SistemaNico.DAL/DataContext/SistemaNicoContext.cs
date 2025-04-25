using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using SistemaNico.Models;

namespace SistemaNico.DAL.DataContext;

public partial class SistemaNicoContext : DbContext
{
    public SistemaNicoContext()
    {
    }

    public SistemaNicoContext(DbContextOptions<SistemaNicoContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Caja> Cajas { get; set; }

    public virtual DbSet<Cuenta> Cuentas { get; set; }

    public virtual DbSet<Gasto> Gastos { get; set; }

    public virtual DbSet<Modulo> Modulos { get; set; }

    public virtual DbSet<ModulosFunciones> ModulosFunciones { get; set; }

    public virtual DbSet<Moneda> Monedas { get; set; }

    public virtual DbSet<Operaciones> Operaciones { get; set; }

    public virtual DbSet<OperacionesTipo> OperacionesTipos { get; set; }

    public virtual DbSet<PuntosDeVenta> PuntosDeVenta { get; set; }

    public virtual DbSet<User> Usuarios { get; set; }

    public virtual DbSet<UsuariosEstado> UsuariosEstados { get; set; }

    public virtual DbSet<UsuariosRoles> UsuariosRoles { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see http://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("Server=DESKTOP-3MT5F5F; Database=Sistema_NicoAvellaneda; Integrated Security=true; Trusted_Connection=True; Encrypt=False");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Caja>(entity =>
        {
            entity.Property(e => e.Concepto)
                .HasMaxLength(200)
                .IsUnicode(false);
            entity.Property(e => e.Egreso).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.Fecha).HasColumnType("datetime");
            entity.Property(e => e.Ingreso).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.Tipo)
                .HasMaxLength(100)
                .IsUnicode(false);

            entity.HasOne(d => d.IdCuentaNavigation).WithMany(p => p.Cajas)
                .HasForeignKey(d => d.IdCuenta)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Cajas_Cuentas");

            entity.HasOne(d => d.IdMonedaNavigation).WithMany(p => p.Cajas)
                .HasForeignKey(d => d.IdMoneda)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Cajas_Monedas");

            entity.HasOne(d => d.IdPuntoVentaNavigation).WithMany(p => p.Cajas)
                .HasForeignKey(d => d.IdPuntoVenta)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Cajas_Puntos_De_Venta");

            entity.HasOne(d => d.IdUsuarioNavigation).WithMany(p => p.Cajas)
                .HasForeignKey(d => d.IdUsuario)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Cajas_Usuarios");
        });

        modelBuilder.Entity<Cuenta>(entity =>
        {
            entity.Property(e => e.Nombre)
                .HasMaxLength(100)
                .IsUnicode(false);

            entity.HasOne(d => d.IdMonedaNavigation).WithMany(p => p.Cuenta)
                .HasForeignKey(d => d.IdMoneda)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Cuentas_Monedas");
        });

        modelBuilder.Entity<Gasto>(entity =>
        {
            entity.Property(e => e.Concepto)
                .HasMaxLength(300)
                .IsUnicode(false);
            entity.Property(e => e.Fecha).HasColumnType("datetime");
            entity.Property(e => e.Importe).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.NotaInterna)
                .HasMaxLength(500)
                .IsUnicode(false);

            entity.HasOne(d => d.IdCajaAsociadoNavigation).WithMany(p => p.Gastos)
                .HasForeignKey(d => d.IdCajaAsociado)
                .HasConstraintName("FK_Gastos_Cajas");

            entity.HasOne(d => d.IdCuentaNavigation).WithMany(p => p.Gastos)
                .HasForeignKey(d => d.IdCuenta)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Gastos_Cuentas");

            entity.HasOne(d => d.IdMonedaNavigation).WithMany(p => p.Gastos)
                .HasForeignKey(d => d.IdMoneda)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Gastos_Monedas");

            entity.HasOne(d => d.IdPuntoVentaNavigation).WithMany(p => p.Gastos)
                .HasForeignKey(d => d.IdPuntoVenta)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Gastos_Puntos_De_Venta");

            entity.HasOne(d => d.IdUsuarioNavigation).WithMany(p => p.Gastos)
                .HasForeignKey(d => d.IdUsuario)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Gastos_Usuarios");
        });

        modelBuilder.Entity<Modulo>(entity =>
        {
            entity.Property(e => e.Nombre)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<ModulosFunciones>(entity =>
        {
            entity.ToTable("Modulos_Funciones");

            entity.Property(e => e.Descripcion)
                .HasMaxLength(200)
                .IsUnicode(false);

            entity.HasOne(d => d.IdModuloNavigation).WithMany(p => p.ModulosFunciones)
                .HasForeignKey(d => d.IdModulo)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Modulos_Funciones_Modulos");
        });

        modelBuilder.Entity<Moneda>(entity =>
        {
            entity.Property(e => e.Nombre)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<Operaciones>(entity =>
        {
            entity.Property(e => e.Cliente)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.Cotizacion).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.Fecha).HasColumnType("datetime");
            entity.Property(e => e.FechaActualizacion).HasColumnType("datetime");
            entity.Property(e => e.ImporteEgreso).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.ImporteIngreso).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.NotaInterna)
                .HasMaxLength(500)
                .IsUnicode(false);

            entity.HasOne(d => d.IdCajaEgresoNavigation).WithMany(p => p.OperacioneIdCajaEgresoNavigations)
                .HasForeignKey(d => d.IdCajaEgreso)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Operaciones_Cajas");

            entity.HasOne(d => d.IdCajaIngresoNavigation).WithMany(p => p.OperacioneIdCajaIngresoNavigations)
                .HasForeignKey(d => d.IdCajaIngreso)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Operaciones_Cajas1");

            entity.HasOne(d => d.IdCuentaEgresoNavigation).WithMany(p => p.OperacioneIdCuentaEgresoNavigations)
                .HasForeignKey(d => d.IdCuentaEgreso)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Operaciones_Cuentas1");

            entity.HasOne(d => d.IdCuentaIngresoNavigation).WithMany(p => p.OperacioneIdCuentaIngresoNavigations)
                .HasForeignKey(d => d.IdCuentaIngreso)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Operaciones_Cuentas");

            entity.HasOne(d => d.IdMonedaEgresoNavigation).WithMany(p => p.OperacioneIdMonedaEgresoNavigations)
                .HasForeignKey(d => d.IdMonedaEgreso)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Operaciones_Monedas1");

            entity.HasOne(d => d.IdMonedaIngresoNavigation).WithMany(p => p.OperacioneIdMonedaIngresoNavigations)
                .HasForeignKey(d => d.IdMonedaIngreso)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Operaciones_Monedas");

            entity.HasOne(d => d.IdPuntoVentaNavigation).WithMany(p => p.Operaciones)
                .HasForeignKey(d => d.IdPuntoVenta)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Operaciones_Puntos_De_Venta");

            entity.HasOne(d => d.IdTipoNavigation).WithMany(p => p.Operaciones)
                .HasForeignKey(d => d.IdTipo)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Operaciones_Operaciones_Tipos");

            entity.HasOne(d => d.IdUsuarioNavigation).WithMany(p => p.OperacioneIdUsuarioNavigations)
                .HasForeignKey(d => d.IdUsuario)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Operaciones_Usuarios");

            entity.HasOne(d => d.IdUsuarioActualizacionNavigation).WithMany(p => p.OperacioneIdUsuarioActualizacionNavigations)
                .HasForeignKey(d => d.IdUsuarioActualizacion)
                .HasConstraintName("FK_Operaciones_Usuarios1");
        });

        modelBuilder.Entity<OperacionesTipo>(entity =>
        {
            entity.ToTable("Operaciones_Tipos");

            entity.Property(e => e.Nombre)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<PuntosDeVenta>(entity =>
        {
            entity.ToTable("Puntos_De_Venta");

            entity.Property(e => e.Nombre)
                .HasMaxLength(300)
                .IsUnicode(false);
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.Property(e => e.Apellido)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.Contrasena)
                .HasMaxLength(255)
                .IsUnicode(false);
            entity.Property(e => e.Direccion)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.Dni)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.Nombre)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.Telefono)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.Usuario)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("Usuario");

            entity.HasOne(d => d.IdEstadoNavigation).WithMany(p => p.Usuarios)
                .HasForeignKey(d => d.IdEstado)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Usuarios_Usuarios_Estados");

            entity.HasOne(d => d.IdRolNavigation).WithMany(p => p.Usuarios)
                .HasForeignKey(d => d.IdRol)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Usuarios_Usuarios_Roles");
        });

        modelBuilder.Entity<UsuariosEstado>(entity =>
        {
            entity.ToTable("Usuarios_Estados");

            entity.Property(e => e.Nombre)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<UsuariosRoles>(entity =>
        {
            entity.ToTable("Usuarios_Roles");

            entity.Property(e => e.Nombre)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}

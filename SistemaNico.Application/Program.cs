using Microsoft.EntityFrameworkCore;
using SistemaNico.BLL.Service;
using SistemaNico.DAL.DataContext;
using SistemaNico.DAL.Repository;
using SistemaNico.Models;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.Extensions.FileProviders;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();

// Configurar la conexi�n a la base de datos
builder.Services.AddDbContext<SistemaNicoContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("cadenaSQL"));
});

// Agregar Razor Pages
builder.Services.AddRazorPages().AddRazorRuntimeCompilation();

// Registrar repositorios y servicios
builder.Services.AddScoped<IUsuariosRepository<User>, UsuariosRepository>();
builder.Services.AddScoped<IUsuariosService, UsuariosService>();

builder.Services.AddScoped<IPuntosDeVentaRepository<PuntosDeVenta>, PuntosDeVentaRepository>();
builder.Services.AddScoped<IPuntosDeVentaService, PuntosDeVentaService>();


builder.Services.AddScoped<ICuentasRepository<Cuenta>, CuentasRepository>();
builder.Services.AddScoped<ICuentasService, CuentasService>();

builder.Services.AddScoped<IRolesRepository<UsuariosRoles>, RolesRepository>();
builder.Services.AddScoped<IRolesService, RolesService>();

builder.Services.AddScoped<IMonedasRepository<Moneda>, MonedasRepository>();
builder.Services.AddScoped<IMonedasService, MonedasService>();

builder.Services.AddScoped<ICajasRepository<Caja>, CajasRepository>();
builder.Services.AddScoped<ICajasService, CajasService>();

builder.Services.AddScoped<IEstadosUsuariosRepository<UsuariosEstado>, EstadosUsuariosRepository>();
builder.Services.AddScoped<IEstadosUsuariosService, EstadosUsuariosService>();

builder.Services.AddScoped<ILoginRepository<User>, LoginRepository>();
builder.Services.AddScoped<ILoginService, LoginService>();

builder.Services.AddScoped<IOperacionesRepository<Operaciones>, OperacionesRepository>();
builder.Services.AddScoped<IOperacionesService, OperacionesService>();

builder.Services.AddScoped<IGastosRepository<Gasto>, GastosRepository>();
builder.Services.AddScoped<IGastosService, GastosService>();

builder.Services.AddControllersWithViews()
    .AddJsonOptions(o =>
    {
        o.JsonSerializerOptions.PropertyNameCaseInsensitive = true;
        o.JsonSerializerOptions.PropertyNamingPolicy = null;
    });

// Configurar autenticaci�n con cookies
builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        options.LoginPath = "/Login/Index";  // Ruta para redirigir al login si no est� autenticado
        options.LogoutPath = "/Login/Logout"; // Ruta para cerrar sesi�n
    });


var app = builder.Build();

// Configurar el pipeline de middleware
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Usuarios/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();

app.UseStaticFiles(new StaticFileOptions
{
    ServeUnknownFileTypes = true,
    FileProvider = new PhysicalFileProvider(
        Path.Combine(Directory.GetCurrentDirectory(), "wwwroot")),
    RequestPath = ""
});


app.UseRouting();

app.UseAuthentication(); // Habilitar la autenticaci�n con cookies
app.UseAuthorization();  // Habilitar la autorizaci�n

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Usuarios}/{action=Index}/{id?}");

// Aseg�rate de que las rutas de login est�n excluidas del middleware de autenticaci�n
app.MapControllerRoute(
    name: "login",
    pattern: "Login/{action=Index}",
    defaults: new { controller = "Login", action = "Index" });
app.Run();

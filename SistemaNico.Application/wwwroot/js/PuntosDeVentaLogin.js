$(document).ready(async () => {
    puntosDeVenta = await listaPuntosDeVenta();
    renderizarPuntosDeVenta(puntosDeVenta);
});

async function listaPuntosDeVenta() {
    const url = `/PuntosDeVenta/ListaActivos`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

function renderizarPuntosDeVenta(lista) {
    const contenedor = $('#contenedorPuntosDeVenta');
    contenedor.empty();

    lista.forEach(punto => {
        const card = `
        <div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
            <div class="card card-pdv text-center animate__animated animate__fadeIn">
                <div class="card-body d-flex flex-column align-items-center justify-content-center">
                    <i class="fa fa-desktop fa-4x mb-3"></i>
                    <h5 class="card-title mb-2">${punto.Nombre}</h5>
                    <button class="btn btn-primary mt-3 w-75 seleccionar-btn" onclick="seleccionarPunto(${punto.Id})">
                        <i class="fa fa-sign-in icono-seleccion"></i> Ingresar
                    </button>

                </div>
            </div>
        </div>`;
        contenedor.append(card);
    });
}


function seleccionarPunto(id) {
    alert(`Punto de venta seleccionado: ${id}`);
    // Podés guardar en sessionStorage o redirigir
}

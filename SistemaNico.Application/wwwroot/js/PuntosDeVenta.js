
document.addEventListener("DOMContentLoaded", () => {
        cargarPuntosDeVenta();
});




    async function toggleEstado(icon) {
  const card = icon.closest('.card-pdv');
    const id = parseInt(card.dataset.id);
    const input = card.querySelector('.pdv-nombre-input');
    const nombre = input.value.trim();
    const activo = card.classList.contains('pdv-activo');

        const nuevoEstado = !activo;

        const res = await fetch("/PuntosDeVenta/Actualizar", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, nombre, activo: nuevoEstado ? 1 : 0 })
        });


    if (res.ok) {
        card.classList.toggle("pdv-activo", nuevoEstado);
    card.classList.toggle("pdv-inactivo", !nuevoEstado);
    icon.classList.toggle("fa-power-off", nuevoEstado);
    icon.classList.toggle("fa-ban", !nuevoEstado);
        console.log(`Estado actualizado a ${nuevoEstado ? 'activo' : 'inactivo'}`);
        await cargarPuntosDeVenta();
  } else {
        alert("Error al cambiar el estado.");
  }
}


async function cargarPuntosDeVenta() {
    const contenedor = document.querySelector("#contenedorPuntosDeVenta");
    if (!contenedor) return;

    contenedor.innerHTML = "";

    const response = await fetch("/PuntosDeVenta/Lista");
    const puntos = await response.json();

    puntos.forEach(p => {
        const col = document.createElement("div");
        col.className = "col";

        const claseEstado = p.Activo ? "pdv-activo" : "pdv-inactivo";
        const iconEstado = p.Activo ? "fa-power-off text-danger" : "fa-ban text-success";

        col.innerHTML = `
        <div class="card card-pdv text-center animate__animated animate__fadeIn ${claseEstado}" data-id="${p.Id}">
            <div class="card-header d-flex justify-content-between align-items-start w-100 border-0 bg-transparent px-3 pt-3">
                <i class="fa ${iconEstado} status-toggle" onclick="toggleEstado(this)" title="Activar/Desactivar"></i>
                <div>
                    ${p.Activo
                ? `<i class="fa fa-pencil edit-btn" onclick="editarNombre(this)" title="Editar"></i>`
                : `<i class="fa fa-pencil edit-btn text-secondary" style="opacity: 0.3; cursor: none !important;" title="No editable"></i>`}

                    <i class="fa fa-check save-btn d-none" onclick="guardarNombre(this)" title="Guardar"></i>
                </div>
            </div>

            <div class="card-body d-flex flex-column align-items-center justify-content-center px-3 pb-4 pt-2">
                <i class="fa fa-desktop fa-4x mb-3 text-white"></i>
                <input type="text" class="pdv-nombre-input mb-3 text-center" value="${p.Nombre}" disabled />
                <button class="btn btn-danger w-75" onclick="eliminarPDV(this)">Eliminar</button>
            </div>
        </div>
        `;

        contenedor.appendChild(col);
    });

    agregarCardNuevo(contenedor);
}


function agregarCardNuevo(contenedor) {
    const col = document.createElement("div");
    col.className = "col";
    col.id = "tarjetaAgregar";

    col.innerHTML = `
        <div class="card card-pdv tarjeta-agregar text-center animate__animated animate__fadeIn">

            <!-- Frontal: Botón Agregar -->
            <div class="card-front d-flex flex-column align-items-center justify-content-center h-100" onclick="mostrarFormularioAgregar()">
                <i class="fa fa-plus fa-3x text-white mb-2"></i>
                <p class="text-white mb-0">Agregar Punto de Venta</p>
            </div>

            <!-- Trasera: Formulario -->
            <div class="card-back d-none text-center h-100 d-flex flex-column justify-content-between">

                <!-- Header -->
                <div class="card-header d-flex justify-content-between align-items-start w-100 border-0 bg-transparent px-3 pt-3">
                    <i class="fa fa-window-close status-toggle text-danger" onclick="cancelarAgregarPDV()" title="Cancelar nuevo"></i>
                    <div>
                        <i class="fa fa-check save-btn text-success cursor-pointer" onclick="insertarNuevoPDV(this)" title="Guardar nuevo"></i>
                    </div>
                </div>

                <!-- Body (igual al resto) -->
                <div class="card-body d-flex flex-column align-items-center justify-content-center px-3 pb-4 pt-2">
                    <i class="fa fa-desktop fa-4x mb-3 text-white"></i>
                    <input type="text" class="pdv-nombre-input pdv-nombre-input-editable mb-3 text-center" placeholder="Nuevo Punto de Venta" />
                </div>

            </div>
        </div>
    `;

    contenedor.appendChild(col);
}


function mostrarFormularioAgregar() {
    const tarjeta = document.querySelector("#tarjetaAgregar .card-pdv");

    const caraFront = tarjeta.querySelector(".card-front");
    const caraBack = tarjeta.querySelector(".card-back");

    caraFront.classList.add("d-none");
    caraBack.classList.remove("d-none");

    const input = caraBack.querySelector("input");
    if (input) input.focus();
}

function cancelarAgregarPDV() {
    const tarjeta = document.querySelector("#tarjetaAgregar .card-pdv");
    const caraFront = tarjeta.querySelector(".card-front");
    const caraBack = tarjeta.querySelector(".card-back");
    const input = tarjeta.querySelector(".pdv-nombre-input");

    if (input) input.value = "";

    caraBack.classList.add("d-none");
    caraFront.classList.remove("d-none");
}


function editarNombre(icon) {
    const card = icon.closest(".card-pdv");
    const input = card.querySelector(".pdv-nombre-input");

    input.disabled = false;
    input.classList.add("editable");
    input.focus();

    card.querySelector(".edit-btn").classList.add("d-none");

    const btnGuardar = card.querySelector(".save-btn");
    btnGuardar.classList.remove("d-none");
    btnGuardar.classList.add("text-success"); // ícono verde
}


async function guardarNombre(icon) {
    const card = icon.closest(".card-pdv");
    const id = card.dataset.id;
    const nombre = card.querySelector(".pdv-nombre-input").value;

    const activo = card.classList.contains("pdv-activo") ? 1 : 0;

    const res = await fetch("/PuntosDeVenta/Actualizar", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, nombre, activo })
    });
    if (res.ok) {
        await cargarPuntosDeVenta();
    } else {
        alert("Error al guardar");
    }
}



async function eliminarPDV(btn) {
    const card = btn.closest(".card-pdv");
    const id = card.dataset.id;

    if (!confirm("¿Estás seguro de eliminar este punto de venta?")) return;

    const res = await fetch(`/PuntosDeVenta/Eliminar?id=${id}`, { method: "DELETE" });

    if (res.ok) {
        await cargarPuntosDeVenta();
    } else {
        alert("Error al eliminar");
    }
}



async function activarAgregarPDV(icon) {
    const card = icon.closest(".card-pdv");
    const input = card.querySelector(".pdv-nombre-input");
    const btnGuardar = card.querySelector("button");

    input.disabled = false;
    icon.classList.add("d-none");
  
    btnGuardar.classList.remove("d-none");
    input.focus();
    
}
async function insertarNuevoPDV(btn) {
    const card = btn.closest(".card-pdv");
    const nombre = card.querySelector(".pdv-nombre-input").value;

    if (nombre.trim() === "") {
        alert("Debe ingresar un nombre.");
        return;
    }

    const res = await fetch("/PuntosDeVenta/Insertar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: 0, nombre, activo: 1 })

    });

    if (res.ok) {
        await cargarPuntosDeVenta();
    } else {
        alert("Error al insertar");
    }
}
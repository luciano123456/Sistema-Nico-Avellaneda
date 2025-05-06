let gridGastos;
let userSession;

const columnConfig = [
    { index: 1, filterType: 'text' },
    { index: 2, filterType: 'text' },
    { index: 3, filterType: 'text' },
    { index: 4, filterType: 'text' },
    { index: 5, filterType: 'text' },
    { index: 6, filterType: 'text' },
    { index: 7, filterType: 'text' },
    { index: 8, filterType: 'text' },
    { index: 9, filterType: 'text' },
];

const Modelo_base = {
    Id: 0,
    Nombre: "",
    Telefono: "",
    Direccion: "",
}

$(document).ready(async () => {

    userSession = JSON.parse(localStorage.getItem('userSession'));

    // Fechas por defecto
    document.getElementById("txtFechaDesde").value = moment().format('YYYY-MM-DD');
    document.getElementById("txtFechaHasta").value = moment().format('YYYY-MM-DD');

    // Filtros visibles solo para admin
    if (userSession.IdRol == 1) {
        document.getElementById("Filtros").removeAttribute("hidden");
        await listaUsuariosFiltro();
        await listaTiposGastosFiltro();
        await listaPuntosDeVentaFiltro();
        await listaGastos(
            document.getElementById("txtFechaDesde").value,
            document.getElementById("txtFechaHasta").value,
            -1, -1, -1
        );
    } else {
        await listaGastos(
            document.getElementById("txtFechaDesde").value,
            document.getElementById("txtFechaHasta").value,
            userSession.IdPuntoVenta,
            userSession.Id, -1
        );
    }


  


    document.querySelectorAll("#formGasto input, #formGasto select, #formGasto textarea").forEach(el => {
        el.setAttribute("autocomplete", "off");
        el.addEventListener("input", () => validarCampoIndividual(el));
        el.addEventListener("change", () => validarCampoIndividual(el));
        el.addEventListener("blur", () => validarCampoIndividual(el));
    });


})

async function listaTiposGastosFiltro() {
   
    const data = await listaTiposGastos();

    $('#TiposGastosFiltro option').remove();

    select = document.getElementById("TiposGastosFiltro");

    option = document.createElement("option");
    option.value = -1;
    option.text = "Todos";
    select.appendChild(option);

    for (i = 0; i < data.length; i++) {
        option = document.createElement("option");
        option.value = data[i].Id;
        option.text = data[i].Nombre;
        select.appendChild(option);

    }
}


async function listaUsuariosFiltro() {
    const url = `/Usuarios/Lista`;
    const response = await fetch(url);
    const data = await response.json();

    $('#UsuariosFiltro option').remove();

    select = document.getElementById("UsuariosFiltro");

    option = document.createElement("option");
    option.value = -1;
    option.text = "Todos";
    select.appendChild(option);

    for (i = 0; i < data.length; i++) {
        option = document.createElement("option");
        option.value = data[i].Id;
        option.text = data[i].Nombre;
        select.appendChild(option);

    }
}

async function listaPuntosDeVentaFiltro() {
    const url = `/PuntosDeVenta/Lista`;
    const response = await fetch(url);
    const data = await response.json();

    $('#PuntosDeVentaFiltro option').remove();

    select = document.getElementById("PuntosDeVentaFiltro");

    option = document.createElement("option");
    option.value = -1;
    option.text = "Todos";
    select.appendChild(option);

    for (i = 0; i < data.length; i++) {
        option = document.createElement("option");
        option.value = data[i].Id;
        option.text = data[i].Nombre;
        select.appendChild(option);

    }
}

async function aplicarFiltros() {
    if (userSession.IdRol == 1) {
        listaGastos(document.getElementById("txtFechaDesde").value, document.getElementById("txtFechaHasta").value, document.getElementById("PuntosDeVentaFiltro").value, document.getElementById("UsuariosFiltro").value, document.getElementById("TiposGastosFiltro").value)
    } else {
        listaGastos(document.getElementById("txtFechaDesde").value, document.getElementById("txtFechaHasta").value, userSession.IdPuntoVenta, userSession.Id, document.getElementById("TiposGastosFiltro").value);
    }
}



function validarCampoIndividual(el) {
    const valor = el.value.trim();
    const esNumero = ["txtImporte"].includes(el.id);
    const feedback = el.nextElementSibling;

    if (feedback && feedback.classList.contains("invalid-feedback")) {
        feedback.textContent = "Campo obligatorio";
    }

    if (el.id === "txtConcepto" || el.id === "txtNotaInterna") {
        el.classList.remove("is-invalid", "is-valid");
        return;
    }


    if (valor === "" || valor === "Seleccionar") {
        el.classList.remove("is-valid");
        el.classList.add("is-invalid");
        verificarErroresGenerales();
        return;
    }

    if (esNumero) {
        const sinFormato = valor.replace(/[^\d,.-]/g, "").replace(/\./g, "").replace(",", ".");
        if (isNaN(parseFloat(sinFormato))) {
            el.classList.remove("is-valid");
            el.classList.add("is-invalid");
            if (feedback) feedback.textContent = "Valor erróneo";
            verificarErroresGenerales();
            return;
        }
    }

    el.classList.remove("is-invalid");
    el.classList.add("is-valid");



    verificarErroresGenerales();
}

function limpiarModal() {
    const formulario = document.querySelector("#formGasto");
    if (!formulario) return;

    formulario.querySelectorAll("input, select, textarea").forEach(el => {
        if (el.tagName === "SELECT") {
            el.selectedIndex = 0;
        } else {
            el.value = "";
        }
        el.classList.remove("is-invalid", "is-valid");
    });

    // Fecha actual
    const fecha = moment.tz("America/Argentina/Buenos_Aires").format("YYYY-MM-DDTHH:mm");
    document.getElementById("txtFecha").value = fecha;

    // Ocultar mensaje general de error
    const errorMsg = document.getElementById("errorCampos");
    if (errorMsg) errorMsg.classList.add("d-none");
}

function verificarErroresGenerales() {
    const errorMsg = document.getElementById("errorCampos");
    const hayInvalidos = document.querySelectorAll("#formGasto .is-invalid").length > 0;
    if (!errorMsg) return;

    if (!hayInvalidos) {
        errorMsg.classList.add("d-none");
    }
}


function validarCampos() {
    const campos = [
        "#txtFecha",
        "#cbMoneda",
        "#txtImporte",
        "#cbCuenta",
        "#cbPuntoDeVenta",
        "#cbTipoGasto"
        // NO incluir: "#txtConcepto", "#txtNota"
    ];


    let valido = true;

    campos.forEach(selector => {
        const campo = document.querySelector(selector);
        const feedback = campo?.nextElementSibling;
        const esNumero = ["#txtImporte"].includes(selector);

        if (!campo || campo.value.trim() === "" || campo.value === "Seleccionar") {
            campo.classList.remove("is-valid");
            campo.classList.add("is-invalid");
            valido = false;
        } else if (esNumero) {
            const sinFormato = campo.value.replace(/[^\d,.-]/g, "").replace(/\./g, "").replace(",", ".");
            if (isNaN(parseFloat(sinFormato))) {
                campo.classList.remove("is-valid");
                campo.classList.add("is-invalid");
                if (feedback) feedback.textContent = "Valor erróneo";
                valido = false;
            } else {
                campo.classList.remove("is-invalid");
                campo.classList.add("is-valid");
            }
        } else {
            campo.classList.remove("is-invalid");
            campo.classList.add("is-valid");
        }
    });


    const errorMsg = document.getElementById("errorCampos");
    if (!valido) {
        errorMsg.classList.remove("d-none");
    } else {
        errorMsg.classList.add("d-none");
    }

    return valido;
}


function guardarGasto() {
    if (validarCampos()) {
        const idGasto = $("#txtIdGasto").val();
        const idCaja = $("#txtIdCaja").val();


        const nuevoGasto = {
            "Id": idGasto !== "" ? parseInt(idGasto) : 0,
            "Fecha": $("#txtFecha").val(),
            "IdPuntoVenta": parseInt($("#cbPuntoDeVenta").val()),
            "IdMoneda": parseInt($("#cbMoneda").val()),
            "IdUsuario": userSession.Id,
            "IdCuenta": parseInt($("#cbCuenta").val()),
            "IdTipo": parseInt($("#cbTipoGasto").val()),
            "IdCajaAsociado": idGasto !== "" ? parseInt(idCaja) : 0,
            "Importe": convertirMonedaAfloat($("#txtImporte").val()),
            "Concepto": $("#txtConcepto").val(),
            "NotaInterna": $("#txtNotaInterna").val()
        };


        const url = idGasto === "" ? "/Gastos/Insertar" : "/Gastos/Actualizar";
        const method = idGasto === "" ? "POST" : "PUT";

        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(nuevoGasto)
        })
            .then(response => {
                if (!response.ok) throw new Error(response.statusText);
                return response.json();
            })
            .then(dataJson => {
                if (dataJson.valor) {
                    const mensaje = idGasto === ""
                        ? "Gasto registrado correctamente"
                        : "Gasto modificado correctamente";

                    $('#modalEdicion').modal('hide');
                    exitoModal(mensaje);
                    aplicarFiltros();
                } else {
                    errorModal('Ocurrió un error al guardar el gasto');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                errorModal('Ocurrió un error al guardar el gasto');
            });
   
    }
}


async function nuevoGasto() {
    limpiarModal();
    const fechaArgentina = moment.tz("America/Argentina/Buenos_Aires").format("YYYY-MM-DDTHH:mm");
    const campoFecha = document.getElementById("txtFecha");
    campoFecha.value = fechaArgentina;
    campoFecha.classList.remove("is-invalid");
    campoFecha.classList.add("is-valid"); // 🟢 activa el tilde verde

    await cargarPuntosDeVenta();
    await cargarMonedas();
    await cargarTiposGastos();

    if (userSession.IdRol != 1) {
        document.getElementById("cbPuntoDeVenta").value = userSession.IdPuntoVenta;
        document.getElementById("cbPuntoDeVenta").setAttribute("disabled", true)
    }

    $('#modalEdicion').modal('show');
    $("#btnGuardar").text("Registrar");
    $("#modalEdicionLabel").text("Nuevo Gasto");
}

document.getElementById("cbMoneda").addEventListener("change", function () {
    const moneda = this.value;
    cargarCuentas(moneda);
});

async function cargarCuentas(moneda) {

    const idComboMoneda = `cbMoneda`;
    const idComboCuenta = `cbCuenta`;
    const selectCuenta = document.getElementById(idComboCuenta);

    // Reiniciar el combo de cuentas
    selectCuenta.innerHTML = "";
    const optionDefault = new Option("Seleccionar", "", true, true);
    optionDefault.disabled = true;
    selectCuenta.appendChild(optionDefault);

    // Si no hay moneda válida, solo muestro "Seleccionar" y valido
    if (!moneda || moneda === "" || moneda === "Seleccionar") {
        validarCampoIndividual(selectCuenta); // ✅ solo esta cuenta
        return;
    }

    // Traer cuentas y poblar
    const data = await listarCuentas(moneda);

    data.forEach(c => {
        selectCuenta.appendChild(new Option(c.Nombre, c.Id));
    });

    // Seleccionar primer cuenta si hay y validar solo esa
    if (data.length > 0) {
        selectCuenta.selectedIndex = 1;
       
    }

    validarCampoIndividual(selectCuenta); // ✅ valida solo esta cuenta
}

document.getElementById("txtImporte").addEventListener("blur", function () {
            let input = this;
            input.value = formatNumber(convertirMonedaAfloat(input.value));

});
async function listarCuentas(moneda) {
    const url = `/Cuentas/ListaPorMonedaOperacion?IdMoneda=${moneda}`;
    const response = await fetch(url);
    const data = await response.json();

    return data;
}



async function cargarMonedas() {

    const data = await listarMonedas();

    const select = document.getElementById(`cbMoneda`);
    select.innerHTML = ""; // limpia todo

    // Agregar opción "Seleccionar"
    const defaultOption = document.createElement("option");
    defaultOption.text = "Seleccionar";
    defaultOption.value = "";
    defaultOption.disabled = true;
    defaultOption.selected = true;
    select.appendChild(defaultOption);

    // Agregar opciones desde la API
    for (let i = 0; i < data.length; i++) {
        const option = document.createElement("option");
        option.value = data[i].Id;
        option.text = data[i].Nombre;
        select.appendChild(option);
    }
}

async function cargarTiposGastos() {

    const data = await listaTiposGastos();

    const select = document.getElementById(`cbTipoGasto`);
    select.innerHTML = ""; // limpia todo

    // Agregar opción "Seleccionar"
    const defaultOption = document.createElement("option");
    defaultOption.text = "Seleccionar";
    defaultOption.value = "";
    defaultOption.disabled = true;
    defaultOption.selected = true;
    select.appendChild(defaultOption);

    // Agregar opciones desde la API
    for (let i = 0; i < data.length; i++) {
        const option = document.createElement("option");
        option.value = data[i].Id;
        option.text = data[i].Nombre;
        select.appendChild(option);
    }
}


async function cargarPuntosDeVenta() {

    const data = await listaPuntosDeVenta();

    const select = document.getElementById(`cbPuntoDeVenta`);
    select.innerHTML = ""; // limpia todo

    // Agregar opción "Seleccionar"
    let defaultOption = document.createElement("option");
    defaultOption.text = "Seleccionar";
    defaultOption.value = "";
    defaultOption.disabled = true;
    defaultOption.selected = true;
    select.appendChild(defaultOption);

    // Agregar opciones desde la API
    for (let i = 0; i < data.length; i++) {
        const option = document.createElement("option");
        option.value = data[i].Id;
        option.text = data[i].Nombre;
        select.appendChild(option);
    }


}

async function listarMonedas() {
    const url = `/Monedas/Lista`;
    const response = await fetch(url);
    const data = await response.json();

    return data;
}

async function listaPuntosDeVenta() {
    const url = `/PuntosDeVenta/Lista`;
    const response = await fetch(url);
    const data = await response.json();

    return data;
}

async function listaTiposGastos() {
    const url = `/GastosTipos/Lista`;
    const response = await fetch(url);
    const data = await response.json();

    return data;
}


async function mostrarModal(modelo) {
    const campos = ["Id", "Gasto", "Nombre", "Apellido", "Dni", "Telefono", "Direccion", "Contrasena", "ContrasenaNueva"];
    campos.forEach(campo => {
        $(`#txt${campo}`).val(modelo[campo]);
    });

    await listaEstados();
    await listaRoles();

    $('#modalEdicion').modal('show');
    $("#btnGuardar").text("Guardar");
    $("#modalEdicionLabel").text("Editar Gasto");

    document.getElementById("lblContrasena").hidden = true;
    document.getElementById("txtContrasena").hidden = true;

    $('#lblGasto, #txtGasto').css('color', '').css('border-color', '');
    $('#lblNombre, #txtNombre').css('color', '').css('border-color', '');
    $('#lblApellido, #txtApellido').css('color', '').css('border-color', '');



}


async function listaGastos(FechaDesde, FechaHasta, IdPuntoVenta, IdUsuario, IdTipoGasto) {
    const url = `/Gastos/Lista?FechaDesde=${FechaDesde}&FechaHasta=${FechaHasta}&IdPuntoVenta=${IdPuntoVenta}&IdUsuario=${IdUsuario}&IdTipoGasto=${IdTipoGasto}`;
    const response = await fetch(url);
    const data = await response.json();
    await configurarDataTable(data);
}

const editarGasto = async id => {
    try {
        const response = await fetch("/Gastos/EditarInfo?id=" + id);
        if (!response.ok) throw new Error("Error al obtener los datos.");

        const data = await response.json();
        if (!data) throw new Error("Sin datos recibidos.");

        // Abre modal y limpia si tenés esa función
        await nuevoGasto(); // opcional: asegurate que limpie y abra el modal

        document.getElementById("txtIdGasto").value = data.Id;
        document.getElementById("txtFecha").value = moment(data.FechaHoraRegistro).format("YYYY-MM-DDTHH:mm");
        document.getElementById("cbMoneda").value = data.IdMoneda;
        document.getElementById("txtIdCaja").value = data.IdCajaAsociado;
        await cargarCuentas(data.IdMoneda); // si las cuentas dependen de la moneda
        document.getElementById("cbCuenta").value = data.IdCuenta;
        document.getElementById("cbTipoGasto").value = data.IdTipo;
        document.getElementById("cbPuntoDeVenta").value = data.IdPuntoVenta;
        document.getElementById("txtImporte").value = formatNumber(data.Importe);
        document.getElementById("txtConcepto").value = data.Concepto;
        document.getElementById("txtNotaInterna").value = data.NotaInterna || "";

        document.getElementById("btnRegistrarMovimiento").innerText = "Guardar";
        document.getElementById("modalEdicionLabel").innerText = "Editar Gasto";

        $('#modalEdicion').modal('show');

        validarCampos();

    } catch (error) {
        console.error(error);
        errorModal("Error al editar el gasto.");
    }
};

async function calcularGastos() {
    let data = gridGastos.rows().data(); // 👈 TODOS los datos, no solo la página actual


    let total = 0;

    for (let i = 0; i < data.length; i++) {
        total += parseFloat(data[i].Importe) || 0;
    }


    document.getElementById("txtTotalGasto").value = formatNumber(total);

    const inputSaldo = document.getElementById("txtTotalGasto");

    inputSaldo.style.fontWeight = "bold"; // 👈 negrita

   

}


async function eliminarGasto(id) {
    let resultado = window.confirm("¿Desea eliminar el Gasto?");

    if (resultado) {
        try {
            const response = await fetch("/Gastos/Eliminar?id=" + id, {
                method: "DELETE"
            });

            if (!response.ok) {
                throw new Error("Error al eliminar el Gasto.");
            }

            const dataJson = await response.json();

            if (dataJson.valor) {
                aplicarFiltros();
                exitoModal("Gasto eliminado correctamente")
            }
        } catch (error) {
            console.error("Ha ocurrido un error:", error);
        }
    }
}

async function configurarDataTable(data) {
    if (!gridGastos) {
        $('#grd_Gastos thead tr').clone(true).addClass('filters').appendTo('#grd_Gastos thead');
        gridGastos = $('#grd_Gastos').DataTable({
            data: data,
            language: {
                sLengthMenu: "Mostrar MENU registros",
                lengthMenu: "Anzeigen von _MENU_ Einträgen",
                url: "//cdn.datatables.net/plug-ins/2.0.7/i18n/es-MX.json"
            },
            scrollX: "100px",
            scrollCollapse: true,
            columns: [
                {
                    data: "Id",
                    title: '',
                    width: "1%", // Ancho fijo para la columna
                    render: function (data) {
                        return `
                <div class="acciones-menu" data-id="${data}">
                    <button class='btn btn-sm btnacciones' type='button' onclick='toggleAcciones(${data})' title='Acciones'>
                        <i class='fa fa-ellipsis-v fa-lg text-white' aria-hidden='true'></i>
                    </button>
                    <div class="acciones-dropdown" style="display: none;">
                        <button class='btn btn-sm btneditar' type='button' onclick='editarGasto(${data})' title='Editar'>
                            <i class='fa fa-pencil-square-o fa-lg text-success' aria-hidden='true'></i> Editar
                        </button>
                        <button class='btn btn-sm btneliminar' type='button' onclick='eliminarGasto(${data})' title='Eliminar'>
                            <i class='fa fa-trash-o fa-lg text-danger' aria-hidden='true'></i> Eliminar
                        </button>
                    </div>
                </div>`;
                    },
                    orderable: false,
                    searchable: false,
                },
                { data: 'Fecha' },
                { data: 'Usuario' },
                { data: 'PuntoDeVenta' },
                { data: 'Moneda' },
                { data: 'Cuenta' },
                { data: 'Concepto' },
                { data: 'Importe' },
                { data: 'NotaInterna' },
               
               

            ],
            dom: 'Bfrtip',
            buttons: [
                {
                    extend: 'excelHtml5',
                    text: 'Exportar Excel',
                    filename: 'Reporte Gastos',
                    title: '',
                    exportOptions: {
                        columns: [1, 2, 3, 4,5,6,7,8]
                    },
                    className: 'btn-exportar-excel',
                },
                {
                    extend: 'pdfHtml5',
                    text: 'Exportar PDF',
                    filename: 'Reporte Gastos',
                    title: '',
                    exportOptions: {
                        columns: [1, 2, 3, 4, 5, 6, 7, 8]
                    },
                    className: 'btn-exportar-pdf',
                },
                {
                    extend: 'print',
                    text: 'Imprimir',
                    title: '',
                    exportOptions: {
                        columns: [1, 2, 3, 4, 5, 6, 7, 8]
                    },
                    className: 'btn-exportar-print'
                },
                'pageLength'
            ],
            orderCellsTop: true,
            fixedHeader: false,

            "columnDefs": [
                {
                    "render": function (data, type, row) {
                        return formatNumber(data); // Formatear números
                    },
                    "targets": [7] // Índices de las columnas de números
                },
                {
                    "render": function (data, type, row) {
                        if (data) {
                            return moment(data).format('DD/MM/YYYY HH:mm');
                        }
                        return '';
                    },
                    "targets": [1]
                }


            ],

            initComplete: async function () {
                var api = this.api();

                calcularGastos();

                // Iterar sobre las columnas y aplicar la configuración de filtros
                columnConfig.forEach(async (config) => {
                    var cell = $('.filters th').eq(config.index);

                    if (config.filterType === 'select') {
                        var select = $('<select id="filter' + config.index + '"><option value="">Seleccionar</option></select>')
                            .appendTo(cell.empty())
                            .on('change', async function () {
                                var val = $(this).val();
                                var selectedText = $(this).find('option:selected').text(); // Obtener el texto del nombre visible
                                await api.column(config.index).search(val ? '^' + selectedText + '$' : '', true, false).draw(); // Buscar el texto del nombre
                            });

                        var data = await config.fetchDataFunc(); // Llamada a la función para obtener los datos
                        data.forEach(function (item) {
                            select.append('<option value="' + item.Id + '">' + item.Nombre + '</option>')
                        });

                    } else if (config.filterType === 'text') {
                        var input = $('<input type="text" placeholder="Buscar..." />')
                            .appendTo(cell.empty())
                            .off('keyup change') // Desactivar manejadores anteriores
                            .on('keyup change', function (e) {
                                e.stopPropagation();
                                var regexr = '({search})';
                                var cursorPosition = this.selectionStart;
                                api.column(config.index)
                                    .search(this.value != '' ? regexr.replace('{search}', '(((' + this.value + ')))') : '', this.value != '', this.value == '')
                                    .draw();
                                $(this).focus()[0].setSelectionRange(cursorPosition, cursorPosition);
                            });
                    }
                });

                $('.filters th').eq(0).html('');

                configurarOpcionesColumnas();

                setTimeout(function () {
                    gridGastos.columns.adjust();
                }, 10);

                $('body').on('mouseenter', '#grd_Gastos .fa-map-marker', function () {
                    $(this).css('cursor', 'pointer');
                });



                $('body').on('click', '#grd_Gastos .fa-map-marker', function () {
                    var locationText = $(this).parent().text().trim().replace(' ', ' '); // Obtener el texto visible
                    var url = 'https://www.google.com/maps?q=' + encodeURIComponent(locationText);
                    window.open(url, '_blank');
                });

            },
        });
    } else {
        gridGastos.clear().rows.add(data).draw();
        calcularGastos();
    }
}


async function listaRoles() {
    const url = `/Roles/Lista`;
    const response = await fetch(url);
    const data = await response.json();

    $('#Roles option').remove();

    select = document.getElementById("Roles");

    for (i = 0; i < data.length; i++) {
        option = document.createElement("option");
        option.value = data[i].Id;
        option.text = data[i].Nombre;
        select.appendChild(option);

    }
}





async function listaRolesFilter() {
    const url = `/Roles/Lista`;
    const response = await fetch(url);
    const data = await response.json();

    return data.map(rol => ({
        Id: rol.Id,
        Nombre: rol.Nombre
    }));

}

function configurarOpcionesColumnas() {
    const grid = $('#grd_Gastos').DataTable(); // Accede al objeto DataTable utilizando el id de la tabla
    const columnas = grid.settings().init().columns; // Obtiene la configuración de columnas
    const container = $('#configColumnasMenu'); // El contenedor del dropdown específico para configurar columnas

    const storageKey = `Gastos_Columnas`; // Clave única para esta pantalla

    const savedConfig = JSON.parse(localStorage.getItem(storageKey)) || {}; // Recupera configuración guardada o inicializa vacía

    container.empty(); // Limpia el contenedor

    columnas.forEach((col, index) => {
        if (col.data && col.data !== "Id") { // Solo agregar columnas que no sean "Id"
            // Recupera el valor guardado en localStorage, si existe. Si no, inicializa en 'false' para no estar marcado.
            const isChecked = savedConfig && savedConfig[`col_${index}`] !== undefined ? savedConfig[`col_${index}`] : true;

            // Asegúrate de que la columna esté visible si el valor es 'true'
            grid.column(index).visible(isChecked);

            const columnName = index != 6 ? col.data : "Direccion";

            // Ahora agregamos el checkbox, asegurándonos de que se marque solo si 'isChecked' es 'true'
            container.append(`
                <li>
                    <label class="dropdown-item">
                        <input type="checkbox" class="toggle-column" data-column="${index}" ${isChecked ? 'checked' : ''}>
                        ${columnName}
                    </label>
                </li>
            `);
        }
    });

    // Asocia el evento para ocultar/mostrar columnas
    $('.toggle-column').on('change', function () {
        const columnIdx = parseInt($(this).data('column'), 10);
        const isChecked = $(this).is(':checked');
        savedConfig[`col_${columnIdx}`] = isChecked;
        localStorage.setItem(storageKey, JSON.stringify(savedConfig));
        grid.column(columnIdx).visible(isChecked);
    });
}



function toggleAcciones(id) {
    var $dropdown = $(`.acciones-menu[data-id="${id}"] .acciones-dropdown`);

    // Si está visible, lo ocultamos, si está oculto lo mostramos
    if ($dropdown.is(":visible")) {
        $dropdown.hide();
    } else {
        // Ocultar todos los dropdowns antes de mostrar el seleccionado
        $('.acciones-dropdown').hide();
        $dropdown.show();
    }
}

$(document).on('click', function (e) {
    // Verificar si el clic está fuera de cualquier dropdown
    if (!$(e.target).closest('.acciones-menu').length) {
        $('.acciones-dropdown').hide(); // Cerrar todos los dropdowns
    }
});
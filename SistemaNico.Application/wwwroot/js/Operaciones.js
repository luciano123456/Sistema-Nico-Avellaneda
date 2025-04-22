let gridOperaciones;
var userSession;

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
    { index: 10, filterType: 'text' },
    { index: 11, filterType: 'text' },
];


$(document).ready(() => {

    userSession = JSON.parse(localStorage.getItem('userSession'));

    document.getElementById("txtFechaDesde").value = moment().format('YYYY-MM-DD');
    document.getElementById("txtFechaHasta").value = moment().format('YYYY-MM-DD');

    if (userSession.IdRol == 1) {
        document.getElementById("Filtros").removeAttribute("hidden");
        listaUsuariosFiltro();
        listaPuntosDeVentaFiltro();
        listaTiposFiltro();
        listaOperaciones(document.getElementById("txtFechaDesde").value, document.getElementById("txtFechaHasta").value, -1, -1, -1);

    } else {
        listaOperaciones(document.getElementById("txtFechaDesde").value, document.getElementById("txtFechaHasta").value, -1, userSession.IdPuntoVenta, userSession.Id);
    }










    document.querySelectorAll("#formCotizacion input, #formCotizacion select").forEach(el => {
        el.setAttribute("autocomplete", "off");
    });

    document.querySelectorAll("input, select").forEach(el => {
        el.addEventListener("input", () => validarCampoIndividual(el));
        el.addEventListener("change", () => validarCampoIndividual(el));
        el.addEventListener("blur", () => validarCampoIndividual(el)); // <<--- solución clave
    });




})


function validarCampoIndividual(el) {
    const valor = el.value.trim();
    const esNumero = ["txtCotizacion", "txtImporteEgreso", "txtImporteIngreso"].includes(el.id);
    const feedback = el.nextElementSibling;

    if (feedback && feedback.classList.contains("invalid-feedback")) {
        feedback.textContent = "Campo obligatorio";
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

    // 👉 Si el campo es uno de los dos selects de cuenta, validamos que sean distintas
    if (el.id === "cbCuentaEgreso" || el.id === "cbCuentaIngreso") {
        validarCuentasDistintas();
    }

    if (el.id === "cbMonedaEgreso" || el.id === "cbMonedaIngreso") {
        validarMonedasDistintas();
    }

    verificarErroresGenerales();
}


function validarMonedasDistintas() {
    const egreso = document.getElementById("cbMonedaEgreso");
    const ingreso = document.getElementById("cbMonedaIngreso");

    const feedbackEgreso = egreso?.nextElementSibling;
    const feedbackIngreso = ingreso?.nextElementSibling;

    const valEgreso = egreso.value.trim();
    const valIngreso = ingreso.value.trim();

    let valido = true;

    egreso.classList.remove("is-invalid", "is-valid");
    ingreso.classList.remove("is-invalid", "is-valid");

    if (valEgreso === "" || valEgreso === "Seleccionar") {
        egreso.classList.add("is-invalid");
        if (feedbackEgreso) feedbackEgreso.textContent = "Campo obligatorio";
        valido = false;
    }

    if (valIngreso === "" || valIngreso === "Seleccionar") {
        ingreso.classList.add("is-invalid");
        if (feedbackIngreso) feedbackIngreso.textContent = "Campo obligatorio";
        valido = false;
    }

    if (valEgreso !== "" && valEgreso !== "Seleccionar" &&
        valIngreso !== "" && valIngreso !== "Seleccionar" &&
        valEgreso === valIngreso) {

        egreso.classList.add("is-invalid");
        ingreso.classList.add("is-invalid");

        if (feedbackEgreso) feedbackEgreso.textContent = "Las monedas no pueden ser iguales";
        if (feedbackIngreso) feedbackIngreso.textContent = "Las monedas no pueden ser iguales";

        valido = false;
    }

    if (valido && valEgreso !== "" && valIngreso !== "" &&
        valEgreso !== "Seleccionar" && valIngreso !== "Seleccionar" &&
        valEgreso !== valIngreso) {

        egreso.classList.add("is-valid");
        ingreso.classList.add("is-valid");

    }

    const errorMsg = document.getElementById("errorCampos");
    if (!valido) {
        errorMsg.classList.remove("d-none");
    }

    return valido;
}


function validarCuentasDistintas() {
    const egreso = document.getElementById("cbCuentaEgreso");
    const ingreso = document.getElementById("cbCuentaIngreso");

    const feedbackEgreso = egreso?.nextElementSibling;
    const feedbackIngreso = ingreso?.nextElementSibling;

    const valEgreso = egreso.value.trim();
    const valIngreso = ingreso.value.trim();

    let valido = true;

    // Reset visual
    egreso.classList.remove("is-invalid", "is-valid");
    ingreso.classList.remove("is-invalid", "is-valid");

    // 1. Validar si están vacíos o en "Seleccionar"
    if (valEgreso === "" || valEgreso === "Seleccionar") {
        egreso.classList.add("is-invalid");
        if (feedbackEgreso) feedbackEgreso.textContent = "Campo obligatorio";
        valido = false;
    }

    if (valIngreso === "" || valIngreso === "Seleccionar") {
        ingreso.classList.add("is-invalid");
        if (feedbackIngreso) feedbackIngreso.textContent = "Campo obligatorio";
        valido = false;
    }

    // 2. Si ambos son válidos, verificar que no sean iguales
    if (valEgreso !== "" && valEgreso !== "Seleccionar" &&
        valIngreso !== "" && valIngreso !== "Seleccionar" &&
        valEgreso === valIngreso) {

        egreso.classList.add("is-invalid");
        ingreso.classList.add("is-invalid");

        if (feedbackEgreso) feedbackEgreso.textContent = "Las cuentas no pueden ser iguales";
        if (feedbackIngreso) feedbackIngreso.textContent = "Las cuentas no pueden ser iguales";

        valido = false;
    }

    // 3. Si ambos son válidos y distintos, marcar como válidos
    if (valido && valEgreso !== "" && valIngreso !== "" &&
        valEgreso !== "Seleccionar" && valIngreso !== "Seleccionar" &&
        valEgreso !== valIngreso) {

        egreso.classList.add("is-valid");
        ingreso.classList.add("is-valid");
    }

    // Mostrar u ocultar mensaje general
    const errorMsg = document.getElementById("errorCampos");
    if (!valido) {
        errorMsg.classList.remove("d-none");
    }

    return valido;
}


function verificarErroresGenerales() {
    const errorMsg = document.getElementById("errorCampos");

    const hayInvalidos = document.querySelectorAll("#formCotizacion .is-invalid").length > 0;

    if (!hayInvalidos) {
        errorMsg.classList.add("d-none");
    }
}



function limpiarErrores() {
    document.querySelectorAll(".is-invalid").forEach(el => el.classList.remove("is-invalid"));
}

function limpiarModal() {
    const formulario = document.querySelector("#formCotizacion");
    if (!formulario) return;

    formulario.querySelectorAll("input, select").forEach(el => {
        if (el.id === "txtFecha") {
            // Fecha actual con zona horaria de Argentina
            const fechaArgentina = moment.tz("America/Argentina/Buenos_Aires").format("YYYY-MM-DDTHH:mm");
            el.value = fechaArgentina;

            // Marcar como válido (con tilde verde)
            el.classList.remove("is-invalid");
            el.classList.add("is-valid");
        } else if (el.tagName === "SELECT") {
            el.selectedIndex = 0;
            el.classList.remove("is-invalid", "is-valid");
        } else {
            el.value = "";
            el.classList.remove("is-invalid", "is-valid");
        }
    });

    // Ocultar mensaje de error general
    const errorMsg = document.getElementById("errorCampos");
    if (errorMsg) errorMsg.classList.add("d-none");
}



function validarCampos() {
    const campos = [
        "#txtFecha",
        "#cbTipoOperacion",
        "#txtCotizacion",
        "#txtCliente",
        "#cbMonedaEgreso",
        "#cbCuentaEgreso",
        "#txtImporteEgreso",
        "#cbMonedaIngreso",
        "#cbCuentaIngreso",
        "#txtImporteIngreso",
        "#cbPuntoVenta"
    ];

    let valido = true;

    campos.forEach(selector => {
        const campo = document.querySelector(selector);
        const feedback = campo?.nextElementSibling;
        const esNumero = ["#txtCotizacion", "#txtImporteEgreso", "#txtImporteIngreso"].includes(selector);

        if (feedback?.classList.contains("invalid-feedback")) {
            feedback.textContent = "Campo obligatorio";
        }

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

    if (!validarCuentasDistintas()) valido = false;
    if (!validarMonedasDistintas()) valido = false;


    const errorMsg = document.getElementById("errorCampos");
    if (!valido) {
        errorMsg.classList.remove("d-none");
    } else {
        errorMsg.classList.add("d-none");
    }

    return valido;
}




async function guardarOperacion() {
    if (validarCampos()) {
        const id = $("#txtId").val();
        const idCajaIngreso = $("#txtIdCajaIngreso").val();
        const idCajaEgreso = $("#txtIdCajaEgreso").val();

        const nuevoModelo = {
            Id: id !== "" ? id : 0,
            IdCajaIngreso: id !== "" ? idCajaIngreso : 0,
            IdCajaEgreso: id !== "" ? idCajaEgreso : 0,
            Cotizacion: convertirMonedaAfloat($("#txtCotizacion").val()) || 0,
            Fecha: $("#txtFecha").val(),
            IdCajaAsociado: 0, // si no tenés este dato en el modal, lo podés dejar fijo o agregarlo
            IdCuentaEgreso: $("#cbCuentaEgreso").val(),
            IdCuentaIngreso: $("#cbCuentaIngreso").val(),
            IdMonedaEgreso: $("#cbMonedaEgreso").val(),
            IdMonedaIngreso: $("#cbMonedaIngreso").val(),
            IdPuntoVenta: $("#cbPuntoVenta").val(), // igual que CajaAsociado, si no está en el modal
            IdTipo: $("#cbTipoOperacion").val(),
            Cliente: $("#txtCliente").val(),
            NotaInterna: $("#txtNota").val(),
            IdUsuario: userSession.Id, // poné acá tu variable global del usuario actual
            ImporteIngreso: convertirMonedaAfloat($("#txtImporteIngreso").val()) || 0,
            ImporteEgreso: convertirMonedaAfloat($("#txtImporteEgreso").val()) || 0
        };

        const url = id === "" ? "/Operaciones/Insertar" : "/Operaciones/Actualizar";
        const method = id === "" ? "POST" : "PUT";

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify(nuevoModelo)
            });

            if (!response.ok) throw new Error(response.statusText);

            const dataJson = await response.json();

            if (dataJson.valor === true) {
                $('#modalCotizacion').modal('hide');
                exitoModal(id === "" ? "Operación registrada correctamente" : "Operación modificada correctamente");
                aplicarFiltros();
            } else {
                errorModal("Hubo un problema al guardar la operación.");
            }
        } catch (error) {
            console.error('Error:', error);
            errorModal("Error inesperado al guardar.");
        }
    }
}


async function nuevaOperacion() {
    limpiarModal();
    limpiarErrores();
    document.getElementById("errorCampos").classList.add("d-none");
    document.getElementById("divModificacion").setAttribute("hidden", "hidden");
    const selectEgreso = document.getElementById(`cbCuentaEgreso`);
    selectEgreso.innerHTML = ""; // limpia todo
    const selectIngreso = document.getElementById(`cbCuentaIngreso`);
    selectIngreso.innerHTML = ""; // limpia todo

    // Obtener fecha y hora actual de Argentina con Moment.js
    const fechaArgentina = moment.tz("America/Argentina/Buenos_Aires").format("YYYY-MM-DDTHH:mm");

    document.getElementById("txtFecha").value = fechaArgentina;
    await listaTipos();
    await listaPuntosDeVenta();
    await listaMonedas('Ingreso');
    await listaMonedas('Egreso');

    if (userSession.IdRol != 1) {
        document.getElementById("cbPuntoVenta").value = userSession.IdPuntoVenta;
        document.getElementById("cbPuntoVenta").setAttribute("disabled", true);
    }

    document.getElementById("btnRegistrarGuardar").innerText = "Registrar";

    $('#modalCotizacion').modal('show');
    $("#btnGuardar").text("Registrar");
    $("#modalCotizacionLabel").text("Nueva Operacion");


}



async function listaOperaciones(FechaDesde, FechaHasta, IdTipoOperacion, IdPuntoVenta, IdUsuario) {
    const url = `/Operaciones/Lista?FechaDesde=${FechaDesde}&FechaHasta=${FechaHasta}&IdTipoOperacion=${IdTipoOperacion}&IdPuntoVenta=${IdPuntoVenta}&IdUsuario=${IdUsuario}`;
    const response = await fetch(url);
    const data = await response.json();
    await configurarDataTable(data);
}


const editarOperacion = id => {
    fetch("/Operaciones/EditarInfo?id=" + id)
        .then(response => {
            if (!response.ok) throw new Error("Ha ocurrido un error.");
            return response.json();
        })
        .then(dataJson => {
            if (dataJson !== null) {
                mostrarModalOperacion(dataJson)
            } else {
                throw new Error("Ha ocurrido un error.");
            }
        })
        .catch(error => {
            errorModal("Ha ocurrido un error.");
        });
}
async function eliminarOperacion(id) {
    let resultado = window.confirm("¿Desea eliminar la operacion?");

    if (resultado) {
        try {
            const response = await fetch("/Operaciones/Eliminar?id=" + id, {
                method: "DELETE"
            });

            if (!response.ok) {
                throw new Error("Error al eliminar la operacion.");
            }

            const dataJson = await response.json();

            if (dataJson.valor) {
                aplicarFiltros();
                exitoModal("Operacion eliminada correctamente")
            }
        } catch (error) {
            console.error("Ha ocurrido un error:", error);
        }
    }
}

async function configurarDataTable(data) {
    if (!gridOperaciones) {
        $('#grd_Operaciones thead tr').clone(true).addClass('filters').appendTo('#grd_Operaciones thead');
        gridOperaciones = $('#grd_Operaciones').DataTable({
            data: data,
            language: {
                lengthMenu: "Mostrar _MENU_ registros por página",
                zeroRecords: "No se encontraron resultados",
                info: "Mostrando _START_ a _END_ de _TOTAL_ registros",
                infoEmpty: "Mostrando 0 a 0 de 0 registros",
                infoFiltered: "(filtrado de _MAX_ registros totales)",
                search: "Buscar:",
                paginate: {
                    first: "Primero",
                    last: "Último",
                    next: "Siguiente",
                    previous: "Anterior"
                },
                loadingRecords: "Cargando...",
                processing: "Procesando..."
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
                        <button class='btn btn-sm btneditar' type='button' onclick='editarOperacion(${data})' title='Editar'>
                            <i class='fa fa-pencil-square-o fa-lg text-success' aria-hidden='true'></i> Editar
                        </button>
                        ${userSession.IdRol == 1
                                ? `<button class='btn btn-sm btneliminar' type='button' onclick='eliminarOperacion(${data})' title='Eliminar'>
                    <i class='fa fa-trash-o fa-lg text-danger' aria-hidden='true'></i> Eliminar
                   </button>`
                                : ''
                            }
                    </div>
                </div>`;
                    },
                    orderable: false,
                    searchable: false,
                },
                { data: 'Fecha' },
                { data: 'Cliente' },
                { data: 'Usuario' },
                { data: 'PuntoDeVenta' },
                { data: 'Tipo' },
                { data: 'Cotizacion' },
                { data: 'CuentaIngreso' },
                { data: 'ImporteIngreso' },
                { data: 'CuentaEgreso' },
                { data: 'ImporteEgreso' },
                { data: 'NotaInterna' },


            ],
            dom: 'Bfrtip',
            buttons: [
                {
                    extend: 'excelHtml5',
                    text: 'Exportar Excel',
                    filename: 'Reporte Operaciones',
                    title: '',
                    exportOptions: {
                        columns: [0, 1, 2]
                    },
                    className: 'btn-exportar-excel',
                },
                {
                    extend: 'pdfHtml5',
                    text: 'Exportar PDF',
                    filename: 'Reporte Operaciones',
                    title: '',
                    exportOptions: {
                        columns: [0, 1, 2]
                    },
                    className: 'btn-exportar-pdf',
                },
                {
                    extend: 'print',
                    text: 'Imprimir',
                    title: '',
                    exportOptions: {
                        columns: [0, 1, 2]
                    },
                    className: 'btn-exportar-print'
                },
                'pageLength'
            ],
            orderCellsTop: true,
            fixedHeader: true,

            "columnDefs": [
                {
                    "render": function (data, type, row) {
                        return formatNumber(data); // Formatear números
                    },
                    "targets": [6, 8, 10] // Índices de las columnas de números
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
                    gridOperaciones.columns.adjust();
                }, 10);

                $('body').on('mouseenter', '#grd_Operaciones .fa-map-marker', function () {
                    $(this).css('cursor', 'pointer');
                });



                $('body').on('click', '#grd_Operaciones .fa-map-marker', function () {
                    var locationText = $(this).parent().text().trim().replace(' ', ' '); // Obtener el texto visible
                    var url = 'https://www.google.com/maps?q=' + encodeURIComponent(locationText);
                    window.open(url, '_blank');
                });

            },
        });
    } else {
        gridOperaciones.clear().rows.add(data).draw();
    }
}



function configurarOpcionesColumnas() {
    const grid = $('#grd_Operaciones').DataTable(); // Accede al objeto DataTable utilizando el id de la tabla
    const columnas = grid.settings().init().columns; // Obtiene la configuración de columnas
    const container = $('#configColumnasMenu'); // El contenedor del dropdown específico para configurar columnas

    const storageKey = `Operaciones_Columnas`; // Clave única para esta pantalla

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

async function listaTipos() {
    const url = `/Operaciones/ListaTipos`;
    const response = await fetch(url);
    const data = await response.json();

    const select = document.getElementById("cbTipoOperacion");
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


async function listaPuntosDeVenta() {
    const url = `/PuntosDeVenta/ListaActivos`;
    const response = await fetch(url);
    const data = await response.json();

    const select = document.getElementById("cbPuntoVenta");
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


async function listarMonedas() {
    const url = `/Monedas/Lista`;
    const response = await fetch(url);
    const data = await response.json();

    return data;
}

async function listaMonedas(tipo) {

    const data = await listarMonedas();

    const select = document.getElementById(`cbMoneda${tipo}`);
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


async function listarCuentas(moneda) {
    const url = `/Cuentas/ListaPorMoneda?IdMoneda=${moneda}`;
    const response = await fetch(url);
    const data = await response.json();

    return data;
}

document.getElementById("cbMonedaEgreso").addEventListener("change", function () {
    const moneda = this.value;
    cargarCuentas("Egreso", moneda);
});

document.getElementById("cbMonedaIngreso").addEventListener("change", function () {
    const moneda = this.value;
    cargarCuentas("Ingreso", moneda);
});


async function cargarCuentas(tipo, moneda) {

    const data = await listarCuentas(moneda);

    const select = document.getElementById(`cbCuenta${tipo}`);
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

const campos = [
    "#txtCotizacion",
    "#txtImporteEgreso",
    "#txtImporteIngreso"
];

campos.forEach(selector => {
    const input = document.querySelector(selector);
    if (input) {
        aplicarFormatoMoneda(input, () => {
        });
    }
});

function aplicarFormatoMoneda(input, callback) {
    input.addEventListener("blur", function () {
        let rawValue = this.value.trim();

        // Eliminar cualquier símbolo no numérico, excepto , y .
        rawValue = rawValue.replace(/[^\d.,-]/g, '');

        // Reemplazar separadores (puntos por nada, comas por punto)
        let parsedValue = parseFloat(rawValue.replace(/\./g, '').replace(',', '.'));

        // Validamos valor antes de formatear
        if (!isNaN(parsedValue)) {
            this.value = formatNumber(parsedValue);
        }

        // Callback opcional
        if (typeof callback === 'function') {
            callback();
        }
    });

    input.addEventListener("focus", function () {
        let cleanValue = this.value.replace(/[^\d.,-]/g, '');
        let parsed = parseFloat(cleanValue.replace(/\./g, '').replace(',', '.'));
        this.value = isNaN(parsed) ? "" : parsed;
    });
}


async function mostrarModalOperacion(modelo) {
    limpiarModal();

    // Fecha con formato compatible con input tipo datetime-local
    const fechaFormateada = moment(modelo.Fecha).format("YYYY-MM-DDTHH:mm");
    document.getElementById("txtFecha").value = fechaFormateada;

    document.getElementById("txtId").value = modelo.Id || "";
    document.getElementById("txtIdCajaIngreso").value = modelo.IdCajaIngreso || "";
    document.getElementById("txtIdCajaEgreso").value = modelo.IdCajaEgreso || "";
    document.getElementById("txtCotizacion").value = formatNumber(modelo.Cotizacion || 0);
    document.getElementById("txtCliente").value = modelo.Cliente || "";
    document.getElementById("txtNota").value = modelo.NotaInterna || "";
    document.getElementById("txtImporteIngreso").value = formatNumber(modelo.ImporteIngreso || 0);
    document.getElementById("txtImporteEgreso").value = formatNumber(modelo.ImporteEgreso || 0);
    document.getElementById("txtImporteEgreso").value = formatNumber(modelo.ImporteEgreso || 0);

    if (modelo.FechaActualizacion && modelo.UsuarioActualizacion) {
        const fechaFormateada = moment(modelo.FechaActualizacion).format("DD/MM/YYYY [a las] HH:mm");
        document.getElementById("lblModificacion").textContent = `Última modificación el día ${fechaFormateada} por ${modelo.UsuarioActualizacion}`;
        document.getElementById("divModificacion").removeAttribute("hidden");
    }


    document.getElementById("btnRegistrarGuardar").innerText = "Guardar";

    await listaTipos();
    await listaPuntosDeVenta();
    await listaMonedas('Ingreso');
    await listaMonedas('Egreso');

    if (userSession.IdRol != 1) {
        document.getElementById("cbPuntoVenta").value = userSession.IdPuntoVenta;
        document.getElementById("cbPuntoVenta").setAttribute("disabled", true);
    }

    document.getElementById("cbTipoOperacion").value = modelo.IdTipo || "";
    document.getElementById("cbPuntoVenta").value = modelo.IdPuntoVenta || "";
    document.getElementById("cbMonedaIngreso").value = modelo.IdMonedaIngreso || "";
    document.getElementById("cbMonedaEgreso").value = modelo.IdMonedaEgreso || "";

    await cargarCuentas("Ingreso", modelo.IdMonedaIngreso);
    await cargarCuentas("Egreso", modelo.IdMonedaEgreso);

    document.getElementById("cbCuentaIngreso").value = modelo.IdCuentaIngreso || "";
    document.getElementById("cbCuentaEgreso").value = modelo.IdCuentaEgreso || "";

    $("#modalCotizacion").modal("show");
    $("#btnGuardar").text("Guardar");
    $("#modalCotizacionLabel").text("Modificar operación");

    // Validar campos una vez cargado
    validarCampos();
}


async function aplicarFiltros() {
    if (userSession.IdRol == 1) {
        listaOperaciones(document.getElementById("txtFechaDesde").value, document.getElementById("txtFechaHasta").value, document.getElementById("TipoDeOperacionFiltro").value, document.getElementById("PuntosDeVentaFiltro").value, document.getElementById("UsuariosFiltro").value)
    } else {
        listaOperaciones(document.getElementById("txtFechaDesde").value, document.getElementById("txtFechaHasta").value, -1, userSession.IdPuntoVenta, userSession.Id);
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

async function listaTiposFiltro() {
    const url = `/Operaciones/ListaTipos`;
    const response = await fetch(url);
    const data = await response.json();

    $('#TipoDeOperacionFiltro option').remove();

    select = document.getElementById("TipoDeOperacionFiltro");

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

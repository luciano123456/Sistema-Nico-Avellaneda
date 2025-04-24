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


$(document).ready(async () => {
    userSession = JSON.parse(localStorage.getItem('userSession'));

    // Fechas por defecto
    document.getElementById("txtFechaDesde").value = moment().format('YYYY-MM-DD');
    document.getElementById("txtFechaHasta").value = moment().format('YYYY-MM-DD');

    // Filtros visibles solo para admin
    if (userSession.IdRol == 1) {
        document.getElementById("Filtros").removeAttribute("hidden");
        await listaUsuariosFiltro();
        await listaPuntosDeVentaFiltro();
        await listaTiposFiltro();
        await listaOperaciones(
            document.getElementById("txtFechaDesde").value,
            document.getElementById("txtFechaHasta").value,
            -1, -1, -1
        );
    } else {
        await listaOperaciones(
            document.getElementById("txtFechaDesde").value,
            document.getElementById("txtFechaHasta").value,
            -1,
            userSession.IdPuntoVenta,
            userSession.Id
        );
    }

    // Desactivar autocomplete y asociar validación individual
    document.querySelectorAll("#formCotizacion input, #formCotizacion select").forEach(el => {
        el.setAttribute("autocomplete", "off");

        el.addEventListener("input", () => validarCampoIndividual(el));
        el.addEventListener("change", () => validarCampoIndividual(el));
        el.addEventListener("blur", () => validarCampoIndividual(el));
    });

    document.getElementById("cbTipoOperacion").addEventListener("change", () => {

        const tipoOperacion = document.getElementById("cbTipoOperacion").value;
        const texto = document.getElementById("cbTipoOperacion").options[document.getElementById("cbTipoOperacion").selectedIndex]?.text?.toUpperCase();

        const divCompra = document.getElementById("divCompra");
        const divVenta = document.getElementById("divVenta");

        // Ocultar ambos inicialmente
        divCompra.hidden = true;
        divVenta.hidden = true;

        if (texto === "COMPRA") {
            divCompra.hidden = false;
            limpiarYValidarCampos(["cbMonedaIngresa_Compra", "cbCuentaIngresa_Compra", "cbMonedaEgresa_Compra", "cbCuentaEgresa_Compra"]);
        } else if (texto === "VENTA") {
            divVenta.hidden = false;
            limpiarYValidarCampos(["cbMonedaEgresa_Venta", "cbCuentaEgresa_Venta", "cbMonedaIngresa_Venta", "cbCuentaIngresa_Venta"]);
        }

        cargarMonedasYLimpiar(); // << ANTES DE SETEAR COMBOS

    });


   
});

function limpiarYValidarCampos(ids) {
    ids.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.selectedIndex = 0; // Volver a "Seleccionar"
            el.classList.remove("is-valid", "is-invalid");
           
        }
    });
}





function validarCampoIndividual(el) {
    const valor = el.value.trim();
    const esNumero = el.id.includes("Importe") || el.id.includes("Cotizacion");
    const feedback = el.nextElementSibling;

    if (!feedback || !feedback.classList.contains("invalid-feedback")) return;

    if (valor === "" || valor === "Seleccionar") {
        el.classList.remove("is-valid");
        el.classList.add("is-invalid");
        feedback.textContent = "Campo obligatorio";
        verificarErroresGenerales();
    } else if (esNumero && isNaN(convertirMonedaAfloat(valor))) {
        el.classList.remove("is-valid");
        el.classList.add("is-invalid");
        feedback.textContent = "Valor erróneo";
        verificarErroresGenerales();
    } else {
        el.classList.remove("is-invalid");
        el.classList.add("is-valid");
        verificarErroresGenerales();
    }

    // Validaciones adicionales
    if (el.id.includes("Moneda")) {
        if (el.id.includes("_Compra")) validarMonedasDistintas("Compra");
        if (el.id.includes("_Venta")) validarMonedasDistintas("Venta");
    }

    if (el.id.includes("Cuenta")) {
        if (el.id.includes("_Compra")) validarCuentasDistintas("Compra");
        if (el.id.includes("_Venta")) validarCuentasDistintas("Venta");
    }
}


function validarMonedasDistintas() {
    const tipoOperacion = document.getElementById("cbTipoOperacion").options[document.getElementById("cbTipoOperacion").selectedIndex]?.text?.toUpperCase();

    let ingreso, egreso;

    if (tipoOperacion === "COMPRA") {
        ingreso = document.getElementById("cbMonedaIngresa_Compra");
        egreso = document.getElementById("cbMonedaEgresa_Compra");
    } else if (tipoOperacion === "VENTA") {
        ingreso = document.getElementById("cbMonedaIngresa_Venta");
        egreso = document.getElementById("cbMonedaEgresa_Venta");
    } else {
        return true; // No aplica si no es compra o venta
    }

    const valIngreso = ingreso?.value.trim() || "";
    const valEgreso = egreso?.value.trim() || "";

    ingreso.classList.remove("is-invalid", "is-valid");
    egreso.classList.remove("is-invalid", "is-valid");

    let valido = true;

    if (valIngreso === "" || valIngreso === "Seleccionar") {
        ingreso.classList.add("is-invalid");
        ingreso.nextElementSibling.textContent = "Campo obligatorio";
        valido = false;
    }

    if (valEgreso === "" || valEgreso === "Seleccionar") {
        egreso.classList.add("is-invalid");
        egreso.nextElementSibling.textContent = "Campo obligatorio";
        valido = false;
    }

    if (valIngreso !== "" && valEgreso !== "" && valIngreso === valEgreso) {
        ingreso.classList.add("is-invalid");
        egreso.classList.add("is-invalid");

        ingreso.nextElementSibling.textContent = "Las monedas no pueden ser iguales";
        egreso.nextElementSibling.textContent = "Las monedas no pueden ser iguales";
        valido = false;
    }

    if (valido && valIngreso !== valEgreso) {
        ingreso.classList.add("is-valid");
        egreso.classList.add("is-valid");
    }

    const errorMsg = document.getElementById("errorCampos");
    if (!valido && errorMsg) errorMsg.classList.remove("d-none");

    return valido;
}

function validarCuentasDistintas() {
    const tipoOperacion = document.getElementById("cbTipoOperacion").options[document.getElementById("cbTipoOperacion").selectedIndex]?.text?.toUpperCase();

    let ingreso, egreso;

    if (tipoOperacion === "COMPRA") {
        ingreso = document.getElementById("cbCuentaIngresa_Compra");
        egreso = document.getElementById("cbCuentaEgresa_Compra");
    } else if (tipoOperacion === "VENTA") {
        ingreso = document.getElementById("cbCuentaIngresa_Venta");
        egreso = document.getElementById("cbCuentaEgresa_Venta");
    } else {
        return true; // No aplica si no es compra o venta
    }

    const valIngreso = ingreso?.value.trim() || "";
    const valEgreso = egreso?.value.trim() || "";

    ingreso.classList.remove("is-invalid", "is-valid");
    egreso.classList.remove("is-invalid", "is-valid");

    let valido = true;

    if (valIngreso === "" || valIngreso === "Seleccionar") {
        ingreso.classList.add("is-invalid");
        ingreso.nextElementSibling.textContent = "Campo obligatorio";
        valido = false;
    }

    if (valEgreso === "" || valEgreso === "Seleccionar") {
        egreso.classList.add("is-invalid");
        egreso.nextElementSibling.textContent = "Campo obligatorio";
        valido = false;
    }

    if (valIngreso !== "" && valEgreso !== "" && valIngreso === valEgreso) {
        ingreso.classList.add("is-invalid");
        egreso.classList.add("is-invalid");

        ingreso.nextElementSibling.textContent = "Las cuentas no pueden ser iguales";
        egreso.nextElementSibling.textContent = "Las cuentas no pueden ser iguales";
        valido = false;
    }

    if (valido && valIngreso !== valEgreso) {
        ingreso.classList.add("is-valid");
        egreso.classList.add("is-valid");
    }

    const errorMsg = document.getElementById("errorCampos");
    if (!valido && errorMsg) errorMsg.classList.remove("d-none");

    return valido;
}

function verificarErroresGenerales() {
    const errorMsg = document.getElementById("errorCampos");
    const hayInvalidos = document.querySelectorAll("#formCotizacion .is-invalid").length > 0;
    if (!errorMsg) return;

    if (!hayInvalidos) {
        errorMsg.classList.add("d-none");
    }
}



function limpiarModal() {
    const formulario = document.querySelector("#formCotizacion");
    if (!formulario) return;

    // Limpiar campos comunes
    document.getElementById("txtId").value = "";
    document.getElementById("txtCliente").value = "";
    document.getElementById("cbPuntoVenta").selectedIndex = 0;
    document.getElementById("cbTipoOperacion").selectedIndex = 0;

    // Fecha actual en formato Argentina
    const fechaArgentina = moment.tz("America/Argentina/Buenos_Aires").format("YYYY-MM-DDTHH:mm");
    document.getElementById("txtFecha").value = fechaArgentina;

    // Ocultar bloques
    document.getElementById("divCompra").hidden = true;
    document.getElementById("divVenta").hidden = true;

    // Limpiar campos de COMPRA
    [
        "txtCotizacionCompra",
        "cbMonedaIngresa_Compra", "cbCuentaIngresa_Compra", "txtImporteIngresa_Compra",
        "cbMonedaEgresa_Compra", "cbCuentaEgresa_Compra", "txtImporteEgresa_Compra"
    ].forEach(id => {
        const el = document.getElementById(id);
        if (el?.tagName === "SELECT") {
            el.value = "";
            el.dispatchEvent(new Event("change"));
        } else if (el) {
            el.value = "";
        }
        el?.classList.remove("is-valid", "is-invalid");
    });

    // Limpiar campos de VENTA
    [
        "txtCotizacionVenta",
        "cbMonedaEgresa_Venta", "cbCuentaEgresa_Venta", "txtImporteEgresa_Venta",
        "cbMonedaIngresa_Venta", "cbCuentaIngresa_Venta", "txtImporteIngresa_Venta"
    ].forEach(id => {
        const el = document.getElementById(id);
        if (el?.tagName === "SELECT") {
            el.value = "";
            el.dispatchEvent(new Event("change"));
        } else if (el) {
            el.value = "";
        }
        el?.classList.remove("is-valid", "is-invalid");
    });


    // Mensaje de error general
    const errorMsg = document.getElementById("errorCampos");
    if (errorMsg) errorMsg.classList.add("d-none");

    // Limpiar texto de modificación si existía
    const divMod = document.getElementById("divModificacion");
    const lblMod = document.getElementById("lblModificacion");
    if (divMod) divMod.hidden = true;
    if (lblMod) lblMod.textContent = "";
}


function validarCampos() {
    limpiarErrores();

    const camposBase = [
        "#txtFecha",
        "#cbPuntoVenta",
        "#cbTipoOperacion"
    ];

    let esValido = true;

    camposBase.forEach(selector => {
        const el = document.querySelector(selector);
        const valor = el?.value?.trim();
        const feedback = el?.nextElementSibling;

        if (!el || valor === "" || valor === "Seleccionar") {
            el?.classList.add("is-invalid");
            feedback && (feedback.textContent = "Campo obligatorio");
            esValido = false;
        } else {
            el?.classList.add("is-valid");
        }
    });

    const tipoOperacion = document.getElementById("cbTipoOperacion").options[document.getElementById("cbTipoOperacion").selectedIndex]?.text?.toUpperCase();

    if (!esValido) {
        document.getElementById("errorCampos").classList.remove("d-none");
        return false;
    }

    // Validaciones específicas por tipo
    if (tipoOperacion === "COMPRA") {
        esValido = validarCamposCompra();
    } else if (tipoOperacion === "VENTA") {
        esValido = validarCamposVenta();
    }

    const errorMsg = document.getElementById("errorCampos");
    if (!esValido) {
        errorMsg.classList.remove("d-none");
    } else {
        errorMsg.classList.add("d-none");
    }

    return esValido;
}

function validarCamposCompra() {
    const campos = [
        "#txtFecha",
        "#cbPuntoVenta",
        "#cbTipoOperacion",
        "#txtCotizacionCompra",
        "#cbMonedaIngresa_Compra",
        "#cbCuentaIngresa_Compra",
        "#txtImporteIngresa_Compra",
        "#cbMonedaEgresa_Compra",
        "#cbCuentaEgresa_Compra",
        "#txtImporteEgresa_Compra"
    ];

    let esValido = true;

    campos.forEach(selector => {
        const el = document.querySelector(selector);
        if (!el) return;

        const valor = el.value.trim();
        const feedback = el.nextElementSibling;
        const esNumero = el.id.includes("Importe") || el.id.includes("Cotizacion");

        if (valor === "" || valor === "Seleccionar") {
            el.classList.add("is-invalid");
            if (feedback) feedback.textContent = "Campo obligatorio";
            esValido = false;
        } else if (esNumero && isNaN(convertirMonedaAfloat(valor))) {
            el.classList.add("is-invalid");
            if (feedback) feedback.textContent = "Valor erróneo";
            esValido = false;
        } else {
            el.classList.add("is-valid");
        }
    });

    return esValido;
}

function validarCamposVenta() {
    const campos = [
        "#txtFecha",
        "#cbPuntoVenta",
        "#cbTipoOperacion",
        "#txtCotizacionVenta",
        "#cbMonedaEgresa_Venta",
        "#cbCuentaEgresa_Venta",
        "#txtImporteEgresa_Venta",
        "#cbMonedaIngresa_Venta",
        "#cbCuentaIngresa_Venta",
        "#txtImporteIngresa_Venta"
    ];

    let esValido = true;

    campos.forEach(selector => {
        const el = document.querySelector(selector);
        if (!el) return;

        const valor = el.value.trim();
        const feedback = el.nextElementSibling;
        const esNumero = el.id.includes("Importe") || el.id.includes("Cotizacion");

        if (valor === "" || valor === "Seleccionar") {
            el.classList.add("is-invalid");
            if (feedback) feedback.textContent = "Campo obligatorio";
            esValido = false;
        } else if (esNumero && isNaN(convertirMonedaAfloat(valor))) {
            el.classList.add("is-invalid");
            if (feedback) feedback.textContent = "Valor erróneo";
            esValido = false;
        } else {
            el.classList.add("is-valid");
        }
    });

    return esValido;
}


function limpiarErrores() {
    document.querySelectorAll(".is-invalid, .is-valid").forEach(el => {
        el.classList.remove("is-invalid", "is-valid");
    });
}

async function guardarOperacion() {

    // Validación previa
    if (!validarCampos()) return;

    const tipoOperacion = document.getElementById("cbTipoOperacion").options[document.getElementById("cbTipoOperacion").selectedIndex]?.text?.toUpperCase();
    const id = $("#txtId").val();

    const nuevoModelo = {
        Id: id !== "" ? parseInt(id) : 0,
        Fecha: $("#txtFecha").val(),
        IdPuntoVenta: parseInt($("#cbPuntoVenta").val()),
        IdTipo: parseInt($("#cbTipoOperacion").val()),
        Cliente: $("#txtCliente").val(),
        IdCajaEgreso: parseInt($("#txtIdCajaEgreso").val() || 0),
        IdCajaIngreso: parseInt($("#txtIdCajaIngreso").val() || 0),
        IdUsuario: userSession.Id,
        IdUsuarioActualizacion: userSession.Id, // si estás actualizando, mismo usuario por ahora
        NotaInterna: "",

        // Por defecto
        Cotizacion: 0,
        IdMonedaIngreso: 0,
        IdCuentaIngreso: 0,
        ImporteIngreso: 0,
        IdMonedaEgreso: 0,
        IdCuentaEgreso: 0,
        ImporteEgreso: 0
    };

    if (tipoOperacion === "COMPRA") {
        nuevoModelo.Cotizacion = convertirMonedaAfloat($("#txtCotizacionCompra").val());
        nuevoModelo.IdMonedaIngreso = parseInt($("#cbMonedaIngresa_Compra").val());
        nuevoModelo.IdCuentaIngreso = parseInt($("#cbCuentaIngresa_Compra").val());
        nuevoModelo.ImporteIngreso = convertirMonedaAfloat($("#txtImporteIngresa_Compra").val());

        nuevoModelo.IdMonedaEgreso = parseInt($("#cbMonedaEgresa_Compra").val());
        nuevoModelo.IdCuentaEgreso = parseInt($("#cbCuentaEgresa_Compra").val());
        nuevoModelo.ImporteEgreso = convertirMonedaAfloat($("#txtImporteEgresa_Compra").val());
    } else if (tipoOperacion === "VENTA") {
        nuevoModelo.Cotizacion = convertirMonedaAfloat($("#txtCotizacionVenta").val());
        nuevoModelo.IdMonedaEgreso = parseInt($("#cbMonedaEgresa_Venta").val());
        nuevoModelo.IdCuentaEgreso = parseInt($("#cbCuentaEgresa_Venta").val());
        nuevoModelo.ImporteEgreso = convertirMonedaAfloat($("#txtImporteEgresa_Venta").val());

        nuevoModelo.IdMonedaIngreso = parseInt($("#cbMonedaIngresa_Venta").val());
        nuevoModelo.IdCuentaIngreso = parseInt($("#cbCuentaIngresa_Venta").val());
        nuevoModelo.ImporteIngreso = convertirMonedaAfloat($("#txtImporteIngresa_Venta").val());
    }

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


async function nuevaOperacion() {
    limpiarModal();
    limpiarErrores();

    document.getElementById("errorCampos").classList.add("d-none");
    document.getElementById("divModificacion").setAttribute("hidden", "hidden");

    const fechaArgentina = moment.tz("America/Argentina/Buenos_Aires").format("YYYY-MM-DDTHH:mm");
    document.getElementById("txtFecha").value = fechaArgentina;
    document.getElementById("txtFecha").classList.add("is-valid"); // ✅ Marca como campo válido


    await listaTipos();
    await listaPuntosDeVenta();
   
    if (userSession.IdRol != 1) {
        document.getElementById("cbPuntoVenta").value = userSession.IdPuntoVenta;
        document.getElementById("cbPuntoVenta").setAttribute("disabled", true);
    }

 

    document.getElementById("btnRegistrarGuardar").innerText = "Registrar";
    document.getElementById("modalCotizacionLabel").textContent = "Nueva Operación";

    $('#modalCotizacion').modal('show');
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

async function mostrarModalOperacion(modelo) {
    limpiarModal();
    limpiarErrores();
    await listaPuntosDeVenta();
    await listaTipos();

    const fechaFormateada = moment(modelo.Fecha).format("YYYY-MM-DDTHH:mm");
    document.getElementById("txtFecha").value = fechaFormateada;
    document.getElementById("txtId").value = modelo.Id || "";
    document.getElementById("txtCliente").value = modelo.Cliente || "";
    document.getElementById("cbPuntoVenta").value = modelo.IdPuntoVenta || "";

    await cargarMonedasYLimpiar(); // << ANTES DE SETEAR COMBOS

    document.getElementById("cbTipoOperacion").value = modelo.IdTipo || "";
    document.getElementById("cbTipoOperacion").dispatchEvent(new Event("change"));
    document.getElementById("txtIdCajaEgreso").value = modelo.IdCajaEgreso;
    document.getElementById("txtIdCajaIngreso").value = modelo.IdCajaIngreso;
    



    const tipoOperacion = modelo.Tipo.toUpperCase();

    if (tipoOperacion === "COMPRA") {
        document.getElementById("txtCotizacionCompra").value = formatNumber(modelo.Cotizacion || 0);
        document.getElementById("txtImporteIngresa_Compra").value = formatNumber(modelo.ImporteIngreso || 0);
        document.getElementById("txtImporteEgresa_Compra").value = formatNumber(modelo.ImporteEgreso || 0);

        await cargarCuentasNueva(modelo.IdMonedaIngreso, "Compra", "Ingresa");
        await cargarCuentasNueva(modelo.IdMonedaEgreso, "Compra", "Egresa");

        document.getElementById("cbCuentaEgresa_Compra").value = modelo.IdCuentaEgreso;
        document.getElementById("cbCuentaIngresa_Compra").value = modelo.IdCuentaIngreso;
        document.getElementById("cbMonedaEgresa_Compra").value = modelo.IdMonedaEgreso;
        document.getElementById("cbMonedaIngresa_Compra").value = modelo.IdMonedaIngreso;

        document.getElementById("divCompra").removeAttribute("hidden");

    } else if (tipoOperacion === "VENTA") {
        document.getElementById("divVenta").removeAttribute("hidden");
        document.getElementById("txtCotizacionVenta").value = formatNumber(modelo.Cotizacion || 0);
        document.getElementById("txtImporteIngresa_Venta").value = formatNumber(modelo.ImporteIngreso || 0);
        document.getElementById("txtImporteEgresa_Venta").value = formatNumber(modelo.ImporteEgreso || 0);

       
        await cargarCuentasNueva(modelo.IdMonedaIngreso, "Venta", "Ingresa");
        await cargarCuentasNueva(modelo.IdMonedaEgreso, "Venta", "Egresa");

        document.getElementById("cbCuentaEgresa_Venta").value = modelo.IdCuentaEgreso;
        document.getElementById("cbCuentaIngresa_Venta").value = modelo.IdCuentaIngreso;
        document.getElementById("cbMonedaEgresa_Venta").value = modelo.IdMonedaEgreso;
        document.getElementById("cbMonedaIngresa_Venta").value = modelo.IdMonedaIngreso;

       
    }

    if (userSession.IdRol != 1) {
        document.getElementById("cbPuntoVenta").value = userSession.IdPuntoVenta;
        document.getElementById("cbPuntoVenta").setAttribute("disabled", true);
    }

    if (modelo.IdUsuarioActualizacion && modelo.FechaActualizacion) {
        const fechaMod = moment(modelo.FechaActualizacion).format("DD/MM/YYYY HH:mm");
        document.getElementById("divModificacion").hidden = false;
        document.getElementById("lblModificacion").textContent = `Última modificación por ${modelo.UsuarioActualizacion} el ${fechaMod}`;
    }

    document.getElementById("btnRegistrarGuardar").innerText = "Guardar";
    document.getElementById("modalCotizacionLabel").innerText = "Modificar operación";

    validarCampos()

    $("#modalCotizacion").modal("show");
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


async function listarCuentas(moneda) {
    const url = `/Cuentas/ListaPorMoneda?IdMoneda=${moneda}`;
    const response = await fetch(url);
    const data = await response.json();

    return data;
}

async function listarCuentasOperacion(moneda) {
    const url = `/Cuentas/ListaPorMonedaOperacion?IdMoneda=${moneda}`;
    const response = await fetch(url);
    const data = await response.json();

    return data;
}


["txtCotizacionCompra", "txtCotizacionVenta",
    "txtImporteIngresa_Compra", "txtImporteEgresa_Compra",
    "txtImporteIngresa_Venta", "txtImporteEgresa_Venta"
].forEach(id => {
    const input = document.getElementById(id);
    if (input) {
        input.addEventListener("blur", () => {
            input.value = formatNumber(convertirMonedaAfloat(input.value));
        });
    }
});

async function cargarMonedasYLimpiar() {
    const data = await listarMonedas();
    const textoOperacion = document.getElementById("cbTipoOperacion")
        .options[document.getElementById("cbTipoOperacion").selectedIndex]?.text?.toUpperCase();

    const excluirARS_SegunOperacion = {
        "COMPRA": {
            cbMonedaIngresa_Compra: true,   // nunca se compra ARS
            cbMonedaEgresa_Compra: false    // se paga con ARS
        },
        "VENTA": {
            cbMonedaEgresa_Venta: true,     // nunca se vende ARS
            cbMonedaIngresa_Venta: false    // se recibe ARS
        }
    };

    const estructura = excluirARS_SegunOperacion[textoOperacion] || {};

    for (const [id, excluirARS] of Object.entries(estructura)) {
        const select = document.getElementById(id);
        if (!select) continue;

        select.innerHTML = "";

        const defaultOption = new Option("Seleccionar", "", true, true);
        defaultOption.disabled = true;
        select.appendChild(defaultOption);

        const monedasFiltradas = excluirARS
            ? data.filter(mon => mon.Nombre.toUpperCase() !== "ARS")
            : data;

        monedasFiltradas.forEach(mon => {
            select.appendChild(new Option(mon.Nombre, mon.Id));
        });

        validarCampoIndividual(select);
    }
}


async function listarCuentasOperacion(moneda) {
    const url = `/Cuentas/ListaPorMonedaOperacion?IdMoneda=${moneda}`;
    const response = await fetch(url);
    return await response.json();
}

async function cargarCuentasNueva(idMoneda, tipoOperacion, sentido) {
    const idComboMoneda = `cbMoneda${sentido}_${tipoOperacion}`;
    const idComboCuenta = `cbCuenta${sentido}_${tipoOperacion}`;
    const selectCuenta = document.getElementById(idComboCuenta);

    // Reiniciar el combo de cuentas
    selectCuenta.innerHTML = "";
    const optionDefault = new Option("Seleccionar", "", true, true);
    optionDefault.disabled = true;
    selectCuenta.appendChild(optionDefault);

    // Si no hay moneda válida, solo muestro "Seleccionar" y valido
    if (!idMoneda || idMoneda === "" || idMoneda === "Seleccionar") {
        validarCampoIndividual(selectCuenta); // ✅ solo esta cuenta
        return;
    }

    // Traer cuentas y poblar
    const data = await listarCuentasOperacion(idMoneda);

    data.forEach(c => {
        selectCuenta.appendChild(new Option(c.Nombre, c.Id));
    });

    // Seleccionar primer cuenta si hay y validar solo esa
    if (data.length > 0) {
        selectCuenta.selectedIndex = 1;
        validarCampoIndividual(selectCuenta); // ✅ valida solo esta cuenta
    }
}



document.getElementById("cbMonedaIngresa_Compra").addEventListener("change", async (e) => {
    await cargarCuentasNueva(e.target.value, "Compra", "Ingresa");
    actualizarComboOpuesto("Compra", "Ingresa", "Egresa");
    validarMonedasDistintas("Compra");
});

document.getElementById("cbMonedaEgresa_Compra").addEventListener("change", async (e) => {
    await cargarCuentasNueva(e.target.value, "Compra", "Egresa");
    actualizarComboOpuesto("Compra", "Egresa", "Ingresa");
    validarMonedasDistintas("Compra");
});

document.getElementById("cbMonedaIngresa_Venta").addEventListener("change", async (e) => {
    await cargarCuentasNueva(e.target.value, "Venta", "Ingresa");
    actualizarComboOpuesto("Venta", "Ingresa", "Egresa");
    validarMonedasDistintas("Venta");
});

document.getElementById("cbMonedaEgresa_Venta").addEventListener("change", async (e) => {
    await cargarCuentasNueva(e.target.value, "Venta", "Egresa");
    actualizarComboOpuesto("Venta", "Egresa", "Ingresa");
    validarMonedasDistintas("Venta");
});

// VENTA
document.getElementById("txtImporteEgresa_Venta").addEventListener("input", () => {
    actualizarCampoARS_V2("Venta");
});
document.getElementById("txtCotizacionVenta").addEventListener("input", () => {
    actualizarCampoARS_V2("Venta");
});

// COMPRA
document.getElementById("txtImporteIngresa_Compra").addEventListener("input", () => {
    actualizarCampoARS_V2("Compra");
});
document.getElementById("txtCotizacionCompra").addEventListener("input", () => {
    actualizarCampoARS_V2("Compra");
});


async function actualizarComboOpuesto(tipoOperacion, origen, destino) {
    const comboOrigen = document.getElementById(`cbMoneda${origen}_${tipoOperacion}`);
    const comboDestino = document.getElementById(`cbMoneda${destino}_${tipoOperacion}`);

    const idSeleccionadaOrigen = comboOrigen.value;
    const valorDestinoActual = comboDestino.value;

    const data = await listarMonedas();

    comboDestino.innerHTML = "";

    const defaultOption = new Option("Seleccionar", "", true, true);
    defaultOption.disabled = true;
    comboDestino.appendChild(defaultOption);

    data.forEach(mon => {
        if (mon.Id != idSeleccionadaOrigen) {
            const option = new Option(mon.Nombre, mon.Id);
            comboDestino.appendChild(option);
        }
    });

    // Intentar restaurar el valor anterior si sigue estando
    const opcionSigueEstando = Array.from(comboDestino.options).some(opt => opt.value == valorDestinoActual);
    if (opcionSigueEstando) {
        comboDestino.value = valorDestinoActual;
    }

    comboDestino.classList.remove("is-valid", "is-invalid");

   
}


function actualizarCampoARS_V2(tipoOperacion) {
    const cbMonedaIngreso = document.getElementById(`cbMonedaIngresa_${tipoOperacion}`);
    const cbMonedaEgreso = document.getElementById(`cbMonedaEgresa_${tipoOperacion}`);
    const txtImporteIngreso = document.getElementById(`txtImporteIngresa_${tipoOperacion}`);
    const txtImporteEgreso = document.getElementById(`txtImporteEgresa_${tipoOperacion}`);
    const txtCotizacion = document.getElementById(`txtCotizacion${tipoOperacion}`);

    const textoMonedaIngreso = cbMonedaIngreso.options[cbMonedaIngreso.selectedIndex]?.text?.toUpperCase();
    const textoMonedaEgreso = cbMonedaEgreso.options[cbMonedaEgreso.selectedIndex]?.text?.toUpperCase();

    const cotizacion = convertirMonedaAfloat(txtCotizacion.value);

    if (tipoOperacion === "Compra") {
        // Compra: egresás ARS, cotizas contra lo que ingresás
        const importeIngreso = convertirMonedaAfloat(txtImporteIngreso.value);
        if (!isNaN(importeIngreso) && !isNaN(cotizacion)) {
            txtImporteEgreso.value = formatNumber(importeIngreso * cotizacion);
        }
    }

    if (tipoOperacion === "Venta") {
        // Venta: ingresás ARS, cotizas contra lo que egresás
        const importeEgreso = convertirMonedaAfloat(txtImporteEgreso.value);
        if (!isNaN(importeEgreso) && !isNaN(cotizacion)) {
            txtImporteIngreso.value = formatNumber(importeEgreso * cotizacion);
        }
    }
}

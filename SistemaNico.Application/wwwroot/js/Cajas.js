let gridCajas;
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
];

const Modelo_base = {
    Id: 0,
    Nombre: "",
    Telefono: "",
    Direccion: "",
}

$(document).ready(async () => {
    userSession = JSON.parse(localStorage.getItem('userSession'));

  
    await listaMonedasFiltro();
    await listaPuntosDeVentaFiltro();

    if (userSession.IdRol == 1) {
        document.getElementById("Filtros").removeAttribute("hidden");
        document.getElementById("txtFechaDesde").value = moment().add(-7, 'days').format('YYYY-MM-DD');
        document.getElementById("txtFechaHasta").value = moment().format('YYYY-MM-DD');
        listaCajas(document.getElementById("txtFechaDesde").value, document.getElementById("txtFechaHasta").value, -1, document.getElementById("MonedasFiltro").value, document.getElementById("CuentasFiltro").value);

    } else {
        document.getElementById("Filtros").removeAttribute("hidden");
        document.getElementById("txtFechaDesde").value = moment().format('YYYY-MM-DD');
        document.getElementById("txtFechaHasta").value = moment().format('YYYY-MM-DD');
        document.getElementById("PuntosDeVentaFiltro").value = userSession.IdPuntoVenta;
        document.getElementById("PuntosDeVentaFiltro").disabled = true;
        document.getElementById("txtFechaDesde").disabled = true;
        document.getElementById("txtFechaHasta").disabled = true;
        listaCajas(document.getElementById("txtFechaDesde").value, document.getElementById("txtFechaHasta").value, userSession.IdPuntoVenta, document.getElementById("MonedasFiltro").value, document.getElementById("CuentasFiltro").value);
    }

    document.getElementById("MonedasFiltro").addEventListener("change", function () {
        const moneda = this.value;
        cargarCuentasFiltro(moneda);
    });
 


})

async function nuevoMovimiento() {
    limpiarModalMovimiento();
    const fechaArgentina = moment.tz("America/Argentina/Buenos_Aires").format("YYYY-MM-DDTHH:mm");
    const campoFecha = document.getElementById("txtFechaMovimiento");
    campoFecha.value = fechaArgentina;
    campoFecha.classList.remove("is-invalid");
    campoFecha.classList.add("is-valid"); // 🟢 activa el tilde verde
    document.getElementById("modalMovimientoLabel").innerText = "Nuevo Movimiento";
   
    await cargarPuntosDeVentaMovimiento();
    await cargarMonedasMovimiento();

    $('#modalMovimiento').modal('show');
}




async function nuevaTransferencia() {
    limpiarModalTransferencia();

    const fechaArgentina = moment.tz("America/Argentina/Buenos_Aires").format("YYYY-MM-DDTHH:mm");

    const campoFecha = document.getElementById("txtFecha");
    userSession = JSON.parse(localStorage.getItem('userSession'));

    campoFecha.value = fechaArgentina;
    campoFecha.classList.remove("is-invalid");
    campoFecha.classList.add("is-valid"); // 🟢 activa el tilde verde

    await cargarMonedas();
    await cargarPuntosDeVenta();

    if (userSession.IdRol != 1) {
        document.getElementById("cbPuntoDeVenta").value = userSession.IdPuntoVenta;
        document.getElementById("cbPuntoDeVenta").setAttribute("disabled", true)
    }
    $('#modalTransferencia').modal('show');
}


document.getElementById("cbMoneda").addEventListener("change", function () {
    const moneda = this.value;
    cargarCuentas(moneda);
});

document.getElementById("cbMonedaMovimiento").addEventListener("change", function () {
    const moneda = this.value;
    cargarCuentasMovimiento(moneda);
});



async function listarCuentas(moneda) {
    const url = `/Cuentas/ListaPorMoneda?IdMoneda=${moneda}`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

async function listaTiposMovimiento() {
    const url = `/Operaciones/ListaTipos`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

async function cargarCuentas(moneda) {

    const data = await listarCuentas(moneda);

    const select = document.getElementById(`cbCuentaDesde`);
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

    const select2 = document.getElementById(`cbCuentaHasta`);
    select2.innerHTML = ""; // limpia todo

    // Agregar opción "Seleccionar"
    defaultOption = document.createElement("option");
    defaultOption.text = "Seleccionar";
    defaultOption.value = "";
    defaultOption.disabled = true;
    defaultOption.selected = true;
    select2.appendChild(defaultOption);

    // Agregar opciones desde la API
    for (let i = 0; i < data.length; i++) {
        const option = document.createElement("option");
        option.value = data[i].Id;
        option.text = data[i].Nombre;
        select2.appendChild(option);
    }
}

async function cargarCuentasMovimiento(moneda) {

    const data = await listarCuentas(moneda);

    const select = document.getElementById(`cbCuentaMovimiento`);
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

async function cargarPuntosDeVentaMovimiento() {

    const data = await listaPuntosDeVenta();

    const select = document.getElementById(`cbPuntoDeVentaMovimiento`);
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

const campos = [
    "#txtImporte",
];

campos.forEach(selector => {
    const input = document.querySelector(selector);
    if (input) {
        aplicarFormatoMoneda(input, () => {
        });
    }
});



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

async function cargarMonedasMovimiento() {

    const data = await listarMonedas();

    const select = document.getElementById(`cbMonedaMovimiento`);
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




async function listaCajas(FechaDesde, FechaHasta, IdPuntoVenta, IdMoneda, IdCuenta) {
    const url = `/Cajas/Lista?FechaDesde=${FechaDesde}&FechaHasta=${FechaHasta}&IdPuntoVenta=${IdPuntoVenta}&IdMoneda=${IdMoneda}&IdCuenta=${IdCuenta}`;
    const response = await fetch(url);
    const data = await response.json();
    await configurarDataTable(data);
}


const editarCaja = async id => {
    try {
        const response = await fetch("/Cajas/EditarInfo?id=" + id);
        if (!response.ok) throw new Error("Error al obtener los datos.");

        const data = await response.json();

        if (!data) throw new Error("Sin datos recibidos.");

        const tipo = data.Tipo?.toUpperCase();

        if (tipo === "USUARIO" || tipo === "TRANS. ENTRE CUENTAS") {
            await nuevoMovimiento(); // abre modal y limpia
            document.getElementById("txtIdMovimiento").value = data.Id;
            document.getElementById("txtFechaMovimiento").value = moment(data.Fecha).format("YYYY-MM-DDTHH:mm");
            document.getElementById("cbMonedaMovimiento").value = data.IdMoneda;
            await cargarCuentasMovimiento(data.IdMoneda);
            document.getElementById("cbCuentaMovimiento").value = data.IdCuenta;
            document.getElementById("txtImporteMovimiento").value = data.IdTipo == 1 ? formatNumber(data.Ingreso) : formatNumber(data.Egreso);
            document.getElementById("txtConceptoMovimiento").value = data.Concepto;
            document.getElementById("cbTipoMovimiento").value = data.IdTipo;
            document.getElementById("cbPuntoDeVentaMovimiento").value = data.IdPuntoVenta;
            document.getElementById("btnRegistrarMovimiento").innerText = "Guardar";
            document.getElementById("modalMovimientoLabel").innerText = "Editar Movimiento";
        } else {
            errorModal("Tipo de caja no compatible para edición.");
        }
    } catch (error) {
        console.error(error);
        errorModal("Error al editar la caja.");
    }
};


async function eliminarCaja(id) {
    let resultado = window.confirm("¿Desea eliminar el Caja?");

    if (resultado) {
        try {
            const response = await fetch("Cajas/Eliminar?id=" + id, {
                method: "DELETE"
            });

            if (!response.ok) {
                throw new Error("Error al eliminar la Caja.");
            }

            const dataJson = await response.json();

            if (dataJson.valor) {
                aplicarFiltros();
                exitoModal("Caja eliminado correctamente")
            }
        } catch (error) {
            console.error("Ha ocurrido un error:", error);
        }
    }
}

async function configurarDataTable(data) {
    if (!gridCajas) {
        $('#grd_Cajas thead tr').clone(true).addClass('filters').appendTo('#grd_Cajas thead');
        gridCajas = $('#grd_Cajas').DataTable({
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
                    width: "1%",
                    render: function (data, type, row) {
                        const tipo = (row.Tipo || "").toUpperCase();

                        if (tipo === "OPERACION" || tipo.includes("SALDO ANTERIOR")) {
                            return ""; // No mostramos nada
                        }

                        return `
        <div class="acciones-menu" data-id="${data}">
            <button class='btn btn-sm btnacciones' type='button' onclick='toggleAcciones(${data})' title='Acciones'>
                <i class='fa fa-ellipsis-v fa-lg text-white' aria-hidden='true'></i>
            </button>
            <div class="acciones-dropdown" style="display: none;">
                <button class='btn btn-sm btneditar' type='button' onclick='editarCaja(${data})' title='Editar'>
                    <i class='fa fa-pencil-square-o fa-lg text-success' aria-hidden='true'></i> Editar
                </button>
                <button class='btn btn-sm btneliminar' type='button' onclick='eliminarCaja(${data})' title='Eliminar'>
                    <i class='fa fa-trash-o fa-lg text-danger' aria-hidden='true'></i> Eliminar
                </button>
            </div>
        </div>`;
                    },
                    orderable: false,
                    searchable: false
                },
                { data: 'Usuario' },
                { data: 'PuntoDeVenta' },
                { data: 'Fecha' },
                {
                    data: 'Tipo',
                    render: function (data, type, row) {
                        if (typeof data === 'string' && data.toLowerCase().includes("saldo anterior")) {
                            return `<span style="color: green; font-weight: bold;">${data}</span>`;
                        }
                        return data;
                    }
                },
                { data: 'Moneda' },
                { data: 'Cuenta' },
                {
                    data: 'Ingreso',
                    render: function (data, type, row) {
                        if (parseFloat(data) > 0) {
                            return `<span style="color: green; font-weight: bold;">${formatNumber(data)}</span>`;
                        } else {
                            return '';
                        }
                        return data;
                    }
                },
                {
                    data: 'Egreso',
                    render: function (data, type, row) {
                        if (parseFloat(data) > 0) {
                            return `<span style="color: red; font-weight: bold;">${formatNumber(data)}</span>`;
                        } else {
                            return '';
                        }
                        return data;
                    }
                },

               

                {
                    data: null,
                    title: 'Saldo',
                    render: function (data, type, row, meta) {
                        if (!this.saldosAcumulados) this.saldosAcumulados = [];

                        let index = meta.row;
                        let ingreso = parseFloat(row.Ingreso) || 0;
                        let egreso = parseFloat(row.Egreso) || 0;

                        let saldoAnterior;

                        // Si es la primera fila y es SALDO ANTERIOR → tomá el campo especial
                        if (index === 0 && row.SaldoAnterior !== undefined) {
                            saldoAnterior = parseFloat(row.SaldoAnterior) || 0;
                        } else {
                            saldoAnterior = index > 0 ? this.saldosAcumulados[index - 1] : 0;
                        }

                        let nuevoSaldo = saldoAnterior + ingreso - egreso;
                        this.saldosAcumulados[index] = nuevoSaldo;

                        const color = nuevoSaldo >= 0 ? 'green' : 'red';
                        return `<span style="color:${color}">${formatNumber(nuevoSaldo)}</span>`;
                    },
                    orderable: false,
                    searchable: false
                },

                 { data: 'Concepto' },

            ],
            dom: 'Bfrtip',
            buttons: [
                {
                    extend: 'excelHtml5',
                    text: 'Exportar Excel',
                    filename: 'Reporte Cajas',
                    title: '',
                    exportOptions: {
                        columns: [0, 1, 2]
                    },
                    className: 'btn-exportar-excel',
                },
                {
                    extend: 'pdfHtml5',
                    text: 'Exportar PDF',
                    filename: 'Reporte Cajas',
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
                        if (data) {
                            return moment(data).format('DD/MM/YYYY HH:mm');
                        }
                        return '';
                    },
                    "targets": [3]
                }
                ],

            

            initComplete: async function () {

                calcularIngresos();

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
                    gridCajas.columns.adjust();
                }, 10);

                $('body').on('mouseenter', '#grd_Cajas .fa-map-marker', function () {
                    $(this).css('cursor', 'pointer');
                });



                $('body').on('click', '#grd_Cajas .fa-map-marker', function () {
                    var locationText = $(this).parent().text().trim().replace(' ', ' '); // Obtener el texto visible
                    var url = 'https://www.google.com/maps?q=' + encodeURIComponent(locationText);
                    window.open(url, '_blank');
                });

            },
        });
    } else {
        gridCajas.clear().rows.add(data).draw();
        calcularIngresos()

    }
}

async function calcularIngresos() {
    let data = gridCajas.rows().data(); // 👈 TODOS los datos, no solo la página actual


    let totalIngreso = 0;
    let totalEgreso = 0;

    for (let i = 0; i < data.length; i++) {
        totalIngreso += parseFloat(data[i].Ingreso) || 0;
        totalEgreso += parseFloat(data[i].Egreso) || 0;
    }

    const totalSaldo = totalIngreso - totalEgreso;

    document.getElementById("txtTotalIngreso").value = formatNumber(totalIngreso);
    document.getElementById("txtTotalEgreso").value = formatNumber(totalEgreso);
    document.getElementById("txtTotalSaldo").value = formatNumber(totalSaldo);

    const inputSaldo = document.getElementById("txtTotalSaldo");

    inputSaldo.style.fontWeight = "bold"; // 👈 negrita

    if (totalSaldo >= 0) {
        inputSaldo.classList.remove("text-danger");
        inputSaldo.classList.add("text-success");
    } else {
        inputSaldo.classList.remove("text-success");
        inputSaldo.classList.add("text-danger");
    }

}

async function listaEstados() {
    const url = `/EstadosCajas/Lista`;
    const response = await fetch(url);
    const data = await response.json();

    $('#Estados option').remove();

    select = document.getElementById("Estados");

    for (i = 0; i < data.length; i++) {
        option = document.createElement("option");
        option.value = data[i].Id;
        option.text = data[i].Nombre;
        select.appendChild(option);

    }
}






function configurarOpcionesColumnas() {
    const grid = $('#grd_Cajas').DataTable(); // Accede al objeto DataTable utilizando el id de la tabla
    const columnas = grid.settings().init().columns; // Obtiene la configuración de columnas
    const container = $('#configColumnasMenu'); // El contenedor del dropdown específico para configurar columnas

    const storageKey = `Cajas_Columnas`; // Clave única para esta pantalla

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


function validarCamposMovimiento() {
    const campos = [
        "#txtFechaMovimiento",
        "#cbMonedaMovimiento",
        "#txtImporteMovimiento",
        "#cbCuentaMovimiento",
        "#cbPuntoDeVentaMovimiento",
        "#cbTipoMovimiento"
        // NO incluir: "#txtConcepto", "#txtNota"
    ];


    let valido = true;

    campos.forEach(selector => {
        const campo = document.querySelector(selector);
        const feedback = campo?.nextElementSibling;
        const esNumero = ["#txtImporteMovimiento"].includes(selector);

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


function validarCamposTransferencia() {
    const campos = [
        "#txtFecha",
        "#cbMoneda",
        "#txtImporte",
        "#cbCuentaDesde",
        "#cbCuentaHasta",
        "#cbPuntoDeVenta"
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

    if (!validarCuentasDistintasTransferencia()) valido = false;

    const errorMsg = document.getElementById("errorCampos");
    if (!valido) {
        errorMsg.classList.remove("d-none");
    } else {
        errorMsg.classList.add("d-none");
    }

    return valido;
}

function validarCampoTransferenciaIndividual(el) {
    const valor = el.value.trim();
    const esNumero = ["txtImporte"].includes(el.id);
    const feedback = el.nextElementSibling;

    if (feedback && feedback.classList.contains("invalid-feedback")) {
        feedback.textContent = "Campo obligatorio";
    }

    if (el.id === "txtConcepto" || el.id === "txtNota") {
        el.classList.remove("is-invalid", "is-valid");
        return;
    }


    if (valor === "" || valor === "Seleccionar") {
        el.classList.remove("is-valid");
        el.classList.add("is-invalid");
        verificarErroresGeneralesTransferencia();
        return;
    }

    if (esNumero) {
        const sinFormato = valor.replace(/[^\d,.-]/g, "").replace(/\./g, "").replace(",", ".");
        if (isNaN(parseFloat(sinFormato))) {
            el.classList.remove("is-valid");
            el.classList.add("is-invalid");
            if (feedback) feedback.textContent = "Valor erróneo";
            verificarErroresGeneralesTransferencia();
            return;
        }
    }

    el.classList.remove("is-invalid");
    el.classList.add("is-valid");

    if (el.id === "cbCuentaDesde" || el.id === "cbCuentaHasta") {
        validarCuentasDistintasTransferencia();
    }

    verificarErroresGeneralesTransferencia();
}

function validarCampoMovimientoIndividual(el) {
    const valor = el.value.trim();
    const esNumero = ["txtImporteMovimiento"].includes(el.id);
    const feedback = el.nextElementSibling;

    if (feedback && feedback.classList.contains("invalid-feedback")) {
        feedback.textContent = "Campo obligatorio";
    }

    if (el.id === "txtConceptoMovimiento" || el.id === "txtNota") {
        el.classList.remove("is-invalid", "is-valid");
        return;
    }


    if (valor === "" || valor === "Seleccionar") {
        el.classList.remove("is-valid");
        el.classList.add("is-invalid");
        verificarErroresGeneralesTransferencia();
        return;
    }

    if (esNumero) {
        const sinFormato = valor.replace(/[^\d,.-]/g, "").replace(/\./g, "").replace(",", ".");
        if (isNaN(parseFloat(sinFormato))) {
            el.classList.remove("is-valid");
            el.classList.add("is-invalid");
            if (feedback) feedback.textContent = "Valor erróneo";
            verificarErroresGeneralesTransferencia();
            return;
        }
    }

    el.classList.remove("is-invalid");
    el.classList.add("is-valid");

    if (el.id === "cbCuentaDesde" || el.id === "cbCuentaHasta") {
        validarCuentasDistintasTransferencia();
    }

    verificarErroresGeneralesTransferencia();
}


function validarCuentasDistintasTransferencia() {
    const desde = document.getElementById("cbCuentaDesde");
    const hasta = document.getElementById("cbCuentaHasta");

    const feedbackDesde = desde?.nextElementSibling;
    const feedbackHasta = hasta?.nextElementSibling;

    const valDesde = desde.value.trim();
    const valHasta = hasta.value.trim();

    let valido = true;

    desde.classList.remove("is-invalid", "is-valid");
    hasta.classList.remove("is-invalid", "is-valid");

    // Validar campos vacíos
    if (valDesde === "" || valDesde === "Seleccionar") {
        desde.classList.add("is-invalid");
        if (feedbackDesde) feedbackDesde.textContent = "Campo obligatorio";
        valido = false;
    }

    if (valHasta === "" || valHasta === "Seleccionar") {
        hasta.classList.add("is-invalid");
        if (feedbackHasta) feedbackHasta.textContent = "Campo obligatorio";
        valido = false;
    }

    // Si ambos están seleccionados y son iguales
    if (
        valDesde !== "" && valDesde !== "Seleccionar" &&
        valHasta !== "" && valHasta !== "Seleccionar" &&
        valDesde === valHasta
    ) {
        desde.classList.add("is-invalid");
        hasta.classList.add("is-invalid");

        if (feedbackDesde) feedbackDesde.textContent = "Las cuentas deben ser diferentes";
        if (feedbackHasta) feedbackHasta.textContent = "Las cuentas deben ser diferentes";

        valido = false;
    }

    // Si son distintos y válidos
    if (valido && valDesde !== "" && valHasta !== "" &&
        valDesde !== "Seleccionar" && valHasta !== "Seleccionar" &&
        valDesde !== valHasta) {

        desde.classList.add("is-valid");
        hasta.classList.add("is-valid");
    }

    // Mostrar u ocultar mensaje general
    const errorMsg = document.getElementById("errorCampos");
    if (!valido) {
        errorMsg.classList.remove("d-none");
    }

    return valido;
}



document.querySelectorAll("#formTransferencia input, #formTransferencia select, #formTransferencia textarea").forEach(el => {
    el.setAttribute("autocomplete", "off");
    el.addEventListener("input", () => validarCampoTransferenciaIndividual(el));
    el.addEventListener("change", () => validarCampoTransferenciaIndividual(el));
    el.addEventListener("blur", () => validarCampoTransferenciaIndividual(el));
});

document.querySelectorAll("#formMovimiento input, #formMovimiento select, #formMovimiento textarea").forEach(el => {
    el.setAttribute("autocomplete", "off");
    el.addEventListener("input", () => validarCampoMovimientoIndividual(el));
    el.addEventListener("change", () => validarCampoMovimientoIndividual(el));
    el.addEventListener("blur", () => validarCampoMovimientoIndividual(el));
});

async function guardarMovimiento() {
    if (validarCamposMovimiento()) {

        const idMovimiento = document.getElementById("txtIdMovimiento").value;

        const nuevoModelo = {
            Id: idMovimiento !== "" ? parseInt(idMovimiento) : 0,
            Fecha: document.getElementById("txtFechaMovimiento").value,
            IdMoneda: parseInt(document.getElementById("cbMonedaMovimiento").value),
            Importe: convertirMonedaAfloat(document.getElementById("txtImporteMovimiento").value),
            Concepto: document.getElementById("txtConceptoMovimiento").value,
            IdCuenta: parseInt(document.getElementById("cbCuentaMovimiento").value),
            IdTipo: parseInt(document.getElementById("cbTipoMovimiento").value),
            IdPuntoVenta: parseInt(document.getElementById("cbPuntoDeVentaMovimiento").value),
            IdUsuario: parseInt(userSession.Id)
        };

        const url = nuevoModelo.Id === 0 ? "/Cajas/InsertarMovimiento" : "/Cajas/ActualizarMovimiento";
        const method = nuevoModelo.Id === 0 ? "POST" : "PUT";

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
                $('#modalMovimiento').modal('hide');
                exitoModal(nuevoModelo.Id === 0 ? "Movimiento registrado correctamente" : "Movimiento actualizado correctamente");
                aplicarFiltros(); // recargar la grilla si corresponde
            } else {
                errorModal("Hubo un problema al guardar el movimiento.");
            }

        } catch (error) {
            console.error("Error:", error);
            errorModal("Error inesperado al guardar el movimiento");
        }
    }
}



async function guardarTransferencia() {
    if (validarCamposTransferencia()) {

        const nuevoModelo = {
            Id: 0,
            Fecha: document.getElementById("txtFecha").value,
            IdMoneda: document.getElementById("cbMoneda").value,
            Importe: convertirMonedaAfloat(document.getElementById("txtImporte").value),
            Concepto: document.getElementById("txtConcepto").value,
            IdCuentaDesde: document.getElementById("cbCuentaDesde").value,
            IdCuentaHasta: document.getElementById("cbCuentaHasta").value,
            IdPuntoVenta: document.getElementById("cbPuntoDeVenta").value,
            Notas: document.getElementById("txtNota").value,
            IdUsuario: userSession.Id
        };

        try {
            const response = await fetch("/Cajas/InsertarTransferencia", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify(nuevoModelo)
            });

            if (!response.ok) throw new Error(response.statusText);

            const dataJson = await response.json();

            if (dataJson.valor === true) {
                $('#modalTransferencia').modal('hide');
                exitoModal("Transferencia registrada correctamente");
                aplicarFiltros(); // recargar la grilla si corresponde
            } else {
                errorModal("Hubo un problema al registrar la transferencia.");
            }

        } catch (error) {
            console.error("Error:", error);
            errorModal("Error inesperado al guardar la transferencia.");
        }
    }
}


function limpiarModalMovimiento() {
    const formulario = document.querySelector("#formMovimiento");
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


function limpiarModalTransferencia() {
    const formulario = document.querySelector("#formTransferencia");
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


function verificarErroresGeneralesTransferencia() {
    const errorMsg = document.getElementById("errorCampos");
    const hayInvalidos = document.querySelectorAll("#formTransferencia .is-invalid").length > 0;
    if (!hayInvalidos) {
        errorMsg.classList.add("d-none");
    }
}


async function aplicarFiltros() {
    if (userSession.IdRol == 1) {
        listaCajas(document.getElementById("txtFechaDesde").value, document.getElementById("txtFechaHasta").value, document.getElementById("PuntosDeVentaFiltro").value, document.getElementById("MonedasFiltro").value, document.getElementById("CuentasFiltro").value);
    } else {
        listaCajas(document.getElementById("txtFechaDesde").value, document.getElementById("txtFechaHasta").value, userSession.IdPuntoVenta, document.getElementById("MonedasFiltro").value, document.getElementById("CuentasFiltro").value);
    }
}

async function listaMonedasFiltro() {
    const url = `/Monedas/Lista`;
    const response = await fetch(url);
    const data = await response.json();

    $('#MonedasFiltro option').remove();

    select = document.getElementById("MonedasFiltro");

    option = document.createElement("option");
    option.value = -1;
    option.text = "Seleccionar";
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

async function listarCuentas(moneda) {
    const url = `/Cuentas/ListaPorMoneda?IdMoneda=${moneda}`;
    const response = await fetch(url);
    const data = await response.json();

    return data;
}

async function cargarCuentasFiltro(moneda) {

    const data = await listarCuentas(moneda);

    const select = document.getElementById(`CuentasFiltro`);
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

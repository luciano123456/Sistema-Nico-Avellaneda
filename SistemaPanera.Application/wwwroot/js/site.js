﻿async function MakeAjax(options) {
    return $.ajax({
        type: options.type,
        url: options.url,
        async: options.async,
        data: options.data,
        dataType: options.dataType,
        contentType: options.contentType
    });
}


async function MakeAjaxFormData(options) {
    return $.ajax({
        type: options.type,
        url: options.url,
        async: options.async,
        data: options.data,
        dataType: false,
        contentType: false,
        isFormData: true,
        processData: false
    });
}


function formatNumber(number) {
    if (typeof number !== 'number' || isNaN(number)) {
        return "$0.00"; // Devuelve un valor predeterminado si 'number' no es válido
    }

    // Asegúrate de que el número tenga dos decimales
    const parts = number.toFixed(2).split(".");

    // Formatea la parte entera con puntos como separadores de miles
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");

    // Combina la parte entera y la parte decimal
    return "$" + parts.join(",");
}


function mostrarModalConContador(modal, texto, tiempo) {
    $(`#${modal}Text`).text(texto);
    $(`#${modal}`).modal('show');

    setTimeout(function () {
        $(`#${modal}`).modal('hide');
    }, tiempo);
}

function exitoModal(texto) {
    mostrarModalConContador('exitoModal', texto, 1000);
}

function errorModal(texto) {
    mostrarModalConContador('ErrorModal', texto, 3000);
}

function advertenciaModal(texto) {
    mostrarModalConContador('AdvertenciaModal', texto, 3000);
}

const formatoMoneda = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS', // Cambia "ARS" por el código de moneda que necesites
    minimumFractionDigits: 2
});

function convertirMonedaAfloat(moneda) {
    // Eliminar el símbolo de la moneda y reemplazar la coma por un punto
    return parseFloat(moneda.replace(/[^0-9,.-]/g, '').replace(',', '.'));
}

function convertirAMonedaDecimal(valor) {
    // Reemplazar coma por punto
    if (typeof valor === 'string') {
        valor = valor.replace(',', '.'); // Cambiar la coma por el punto
    }
    // Convertir a número flotante
    return parseFloat(valor);
}

function formatoNumero(valor) {
    // Reemplaza la coma por punto y elimina otros caracteres no numéricos (como $)
    return parseFloat(valor.replace(/[^0-9,]+/g, '').replace(',', '.')) || 0;
}

function parseDecimal(value) {
    return parseFloat(value.replace(',', '.'));
}


function formatMoneda(valor) {
    // Convertir a string, cambiar el punto decimal a coma y agregar separadores de miles
    let formateado = valor
        .toString()
        .replace('.', ',') // Cambiar punto decimal a coma
        .replace(/\B(?=(\d{3})+(?!\d))/g, "."); // Agregar separadores de miles

    // Agregar el símbolo $ al inicio
    return `$${formateado}`;
}


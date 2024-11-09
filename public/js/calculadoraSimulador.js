const monto = document.getElementById('monto');
const tiempo = document.getElementById('tiempo');
const btnCalcular = document.getElementById('btnCalcular');
const llenarTabla = document.querySelector('#lista-tabla tbody');

btnCalcular.addEventListener('click', () => {
    calcularCuota(monto.value, 1.3, tiempo.value);
});

function calcularCuota(monto, interes, tiempo) {

    // Limpiar tabla
    while (llenarTabla.firstChild) {
        llenarTabla.removeChild(llenarTabla.firstChild);
    }

    let fechas = [];
    let fechaActual = new Date();
    fechaActual.setMonth(fechaActual.getMonth() + 1); // Incrementar al siguiente mes

    let pagoInteres = 0,
        pagoCapital = 0,
        cuota = 0;

    // Cálculo de cuota usando la fórmula de amortización
    cuota = monto * (Math.pow(1 + interes / 100, tiempo) * interes / 100) / (Math.pow(1 + interes / 100, tiempo) - 1);

    for (let i = 1; i <= tiempo; i++) {
        pagoInteres = parseFloat(monto * (interes / 100));
        pagoCapital = cuota - pagoInteres;
        monto = parseFloat(monto - pagoCapital);

        // Formato de fecha (DD-MM-YYYY)
        const dia = String(fechaActual.getDate()).padStart(2, '0');
        const mes = String(fechaActual.getMonth() + 1).padStart(2, '0'); // +1 porque los meses empiezan en 0
        const año = fechaActual.getFullYear();
        fechas[i] = `${dia}-${mes}-${año}`;

        // Incrementar al siguiente mes
        fechaActual.setMonth(fechaActual.getMonth() + 1);

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${fechas[i]}</td>
            <td>${cuota.toFixed(2)}</td>
            <td>${pagoCapital.toFixed(2)}</td>
            <td>${pagoInteres.toFixed(2)}</td>
            <td>${monto.toFixed(2)}</td>
        `;
        llenarTabla.appendChild(row);
    }
}

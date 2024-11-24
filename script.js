// Variables globales
let bicicletasData = [];
let estaciones = [];
let numEstaciones, numBicicletas, numDias;

// Generar la matriz de bicicletas
document.getElementById('generarMatriz').addEventListener('click', function() {
    numEstaciones = parseInt(document.getElementById('numEstaciones').value);
    numBicicletas = parseInt(document.getElementById('numBicicletas').value);
    numDias = parseInt(document.getElementById('numDias').value);

    estaciones = Array.from({ length: numEstaciones }, (_, i) => `E${i + 1}`);
    bicicletasData = Array.from({ length: numBicicletas }, () =>
        Array.from({ length: numDias }, () => estaciones[Math.floor(Math.random() * numEstaciones)])
    );

    document.getElementById('resultados').innerHTML = '<p>Matriz generada correctamente.</p>';
});

// Ejecutar la opción seleccionada
document.getElementById('ejecutarOpcion').addEventListener('click', function() {
    const opcionSeleccionada = document.getElementById('opciones').value;

    switch (opcionSeleccionada) {
        case 'mostrarMatriz':
            mostrarMatriz();
            break;
        case 'mostrarMatrizTransicion':
            mostrarMatrizTransicion();
            break;
        case 'distribucionEstacionaria':
            mostrarDistribucionEstacionaria();
            break;
        case 'calcularProbabilidad':
            calcularProbabilidad();
            break;
        default:
            alert('Por favor selecciona una opción válida.');
            break;
    }
});

// Mostrar la matriz de bicicletas
function mostrarMatriz() {
    if (!bicicletasData.length) {
        alert('Primero genera la matriz de bicicletas.');
        return;
    }

    const resultado = bicicletasData
        .map((bicicleta, index) => `Bicicleta ${index + 1}: ${bicicleta.join(', ')}`)
        .join('<br>');

    document.getElementById('resultados').innerHTML = `<pre>${resultado}</pre>`;
}

// Matriz de transición (Simulación simple)
function mostrarMatrizTransicion() {
    let matriz = [];
    for (let i = 0; i < estaciones.length; i++) {
        matriz[i] = new Array(estaciones.length).fill(0);
    }

    for (let bici of bicicletasData) {
        for (let i = 0; i < bici.length - 1; i++) {
            const estacionActual = estaciones.indexOf(bici[i]);
            const estacionSiguiente = estaciones.indexOf(bici[i + 1]);
            matriz[estacionActual][estacionSiguiente]++;
        }
    }

    document.getElementById('resultados').innerHTML = 'Matriz de transición: <pre>' + JSON.stringify(matriz, null, 2) + '</pre>';
}

// Mostrar distribución estacionaria (simplificada)
function mostrarDistribucionEstacionaria() {
    document.getElementById('resultados').innerHTML = 'Distribución estacionaria no implementada aún.';
}

// Calcular probabilidad
function calcularProbabilidad() {
    document.getElementById('resultados').innerHTML = 'Calcular probabilidad no implementado aún.';
}
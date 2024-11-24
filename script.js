let bicicletasData = [];
let matrizTransicion = [];
let estaciones = [];

// Función para generar la matriz de bicicletas
function generarMatriz() {
    const numEstaciones = parseInt(prompt('Número de estaciones:'));
    const numBicicletas = parseInt(prompt('Número de bicicletas:'));
    const numDias = parseInt(prompt('Número de días:'));

    estaciones = Array.from({ length: numEstaciones }, (_, i) => `E${i + 1}`);
    bicicletasData = Array.from({ length: numBicicletas }, () =>
        Array.from({ length: numDias }, () => estaciones[Math.floor(Math.random() * numEstaciones)])
    );

    mostrarMatrizBicicletas();
}

// Función para mostrar la matriz de bicicletas
function mostrarMatrizBicicletas() {
    if (bicicletasData.length === 0) {
        alert('Primero genera la matriz de bicicletas.');
        return;
    }

    const resultado = bicicletasData
        .map((bicicleta, index) => `B${index + 1}: ${bicicleta.join(', ')}`)
        .join('\n');

    document.getElementById('resultados').innerHTML = `<pre>${resultado}</pre>`;
}

// Función para calcular la matriz de transición
function calcularMatrizTransicion() {
    if (bicicletasData.length === 0) {
        alert('Primero genera la matriz de bicicletas.');
        return;
    }

    matrizTransicion = Array.from({ length: estaciones.length }, () => Array(estaciones.length).fill(0));

    bicicletasData.forEach((bicicleta) => {
        for (let i = 0; i < bicicleta.length - 1; i++) {
            const origen = estaciones.indexOf(bicicleta[i]);
            const destino = estaciones.indexOf(bicicleta[i + 1]);
            matrizTransicion[origen][destino]++;
        }
    });

    matrizTransicion = matrizTransicion.map((col) =>
        col.map((val) => val / (col.reduce((acc, x) => acc + x, 0) || 1))
    );

    mostrarResultadoMatriz(matrizTransicion);
}

// Función para mostrar el resultado de la matriz de transición
function mostrarResultadoMatriz(matriz) {
    document.getElementById('resultados').innerHTML = `<pre>${matriz}</pre>`;
}

// Función para calcular la distribución estacionaria
function calcularDistribucionEstacionaria() {
    if (matrizTransicion.length === 0) {
        alert('Primero calcula la matriz de transición.');
        return;
    }

    let vector = Array(estaciones.length).fill(1 / estaciones.length);

    for (let iter = 0; iter < 100; iter++) {
        const nuevoVector = Array(estaciones.length).fill(0);
        for (let i = 0; i < estaciones.length; i++) {
            for (let j = 0; j < estaciones.length; j++) {
                nuevoVector[i] += matrizTransicion[j][i] * vector[j];
            }
        }
        vector = nuevoVector;
    }

    mostrarResultadoDistribucion(vector);
}

// Función para mostrar el resultado de la distribución estacionaria
function mostrarResultadoDistribucion(vector) {
    const resultado = estaciones
        .map((estacion, index) => `${estacion}: ${vector[index].toFixed(4)}`)
        .join('\n');

    document.getElementById('resultados').innerHTML = `<pre>${resultado}</pre>`;
}

// Función para calcular la probabilidad de ir de una estación a otra en n días
function calcularProbabilidad() {
    const estacionOrigen = document.getElementById('estacionOrigen').value;
    const estacionDestino = document.getElementById('estacionDestino').value;
    const dias = parseInt(document.getElementById('diasProbabilidad').value);

    if (!estacionOrigen || !estacionDestino || isNaN(dias)) {
        alert('Por favor, ingrese todos los datos correctamente.');
        return;
    }

    const origenIndex = estaciones.indexOf(estacionOrigen);
    const destinoIndex = estaciones.indexOf(estacionDestino);

    if (origenIndex === -1 || destinoIndex === -1) {
        alert('Estación no válida.');
        return;
    }

    let probabilidad = matrizTransicion[origenIndex][destinoIndex];
    for (let i = 1; i < dias; i++) {
        probabilidad = matrizTransicion[origenIndex][destinoIndex] * probabilidad;
    }

    document.getElementById('resultados').innerHTML = `La probabilidad de ir de ${estacionOrigen} a ${estacionDestino} en ${dias} días es: ${probabilidad.toFixed(4)}`;
}

// Mostrar formularios cuando el usuario selecciona una opción
document.getElementById('ejecutarOpcion').addEventListener('click', () => {
    const opcion = document.getElementById('selectorOpciones').value;
    switch (opcion) {
        case 'generarMatriz':
            generarMatriz();
            break;
        case 'mostrarMatriz':
            mostrarMatrizBicicletas();
            break;
        case 'verTransicion':
            calcularMatrizTransicion();
            break;
        case 'calcularDistribucion':
            calcularDistribucionEstacionaria();
            break;
        case 'calcularProbabilidad':
            document.getElementById('formularioProbabilidad').style.display = 'block';
            break;
        default:
            alert('Por favor, selecciona una opción válida.');
    }
});

// Calcular probabilidad cuando el usuario hace clic en el botón
document.getElementById('calcularProbabilidadBtn').addEventListener('click', () => {
    calcularProbabilidad();
});

// Mostrar cálculo de distribución estacionaria
document.getElementById('calcularEstacionariaBtn').addEventListener('click', () => {
    calcularDistribucionEstacionaria();
});
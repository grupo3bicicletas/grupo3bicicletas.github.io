// Variables globales
let bicicletasData = [];
let matrizTransicion = [];
let estaciones = [];

// Función para generar la matriz de bicicletas
function generarMatriz() {
    const numEstaciones = parseInt(document.getElementById('numEstaciones').value);
    const numBicicletas = parseInt(document.getElementById('numBicicletas').value);
    const numDias = parseInt(document.getElementById('numDias').value);

    estaciones = Array.from({ length: numEstaciones }, (_, i) => `E${i + 1}`);
    bicicletasData = Array.from({ length: numBicicletas }, () =>
        Array.from({ length: numDias }, () => estaciones[Math.floor(Math.random() * numEstaciones)])
    );

    document.getElementById('resultados').innerHTML = '<p>Matriz generada correctamente.</p>';
}

// Función para mostrar la matriz de bicicletas
function mostrarMatrizBicicletas() {
    if (!bicicletasData.length) {
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
    if (!bicicletasData.length) {
        alert('Primero genera la matriz de bicicletas.');
        return;
    }

    const numEstaciones = estaciones.length;
    matrizTransicion = Array.from({ length: numEstaciones }, () => Array(numEstaciones).fill(0));

    bicicletasData.forEach(bicicleta => {
        for (let i = 0; i < bicicleta.length - 1; i++) {
            const origen = estaciones.indexOf(bicicleta[i]);
            const destino = estaciones.indexOf(bicicleta[i + 1]);
            matrizTransicion[origen][destino]++;
        }
    });

    // Normalizar columnas
    matrizTransicion = matrizTransicion.map(col =>
        col.map(val => val / (col.reduce((acc, x) => acc + x, 0) || 1))
    );

    const resultado = matrizTransicion
        .map((fila, index) => `De ${estaciones[index]}: ${fila.map(v => v.toFixed(2)).join(', ')}`)
        .join('\n');

    document.getElementById('resultados').innerHTML = `<pre>${resultado}</pre>`;
}

// Función para calcular la distribución estacionaria
function calcularDistribucionEstacionaria() {
    if (!matrizTransicion.length) {
        alert('Primero calcula la matriz de transición.');
        return;
    }

    const numEstaciones = estaciones.length;
    let vector = Array(numEstaciones).fill(1 / numEstaciones);

    for (let iter = 0; iter < 100; iter++) {
        const nuevoVector = Array(numEstaciones).fill(0);
        for (let i = 0; i < numEstaciones; i++) {
            for (let j = 0; j < numEstaciones; j++) {
                nuevoVector[i] += matrizTransicion[j][i] * vector[j];
            }
        }
        vector = nuevoVector;
    }

    const resultado = estaciones
        .map((estacion, index) => `${estacion}: ${vector[index].toFixed(4)}`)
        .join('\n');

    document.getElementById('resultados').innerHTML = `<pre>${resultado}</pre>`;
}

// Función para calcular la probabilidad de ir de una estación a otra en 'n' días
function calcularProbabilidad() {
    if (!matrizTransicion.length) {
        alert('Primero calcula la matriz de transición.');
        return;
    }

    const dias = parseInt(document.getElementById('diasProbabilidad').value);
    const estacionOrigen = parseInt(document.getElementById('estacionOrigen').value) - 1;
    const estacionDestino = parseInt(document.getElementById('estacionDestino').value) - 1;

    let matrizPotencia = [...matrizTransicion];
    for (let i = 1; i < dias; i++) {
        matrizPotencia = multiplicarMatrices(matrizPotencia, matrizTransicion);
    }

    const probabilidad = matrizPotencia[estacionOrigen][estacionDestino].toFixed(4);
    document.getElementById('resultados').innerHTML = `<p>La probabilidad de ir de E${estacionOrigen + 1} a E${estacionDestino + 1} en ${dias} días es: ${probabilidad}</p>`;
}

// Función para multiplicar matrices
function multiplicarMatrices(A, B) {
    const n = A.length;
    const resultado = Array.from({ length: n }, () => Array(n).fill(0));
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            for (let k = 0; k < n; k++) {
                resultado[i][j] += A[i][k] * B[k][j];
            }
        }
    }
    return resultado;
}

// Eventos
document.getElementById('generarMatriz').addEventListener('click', generarMatriz);
document.getElementById('verMatriz').addEventListener('click', mostrarMatrizBicicletas);
document.getElementById('verMatrizTransicion').addEventListener('click', calcularMatrizTransicion);
document.getElementById('verDistribucionEstacionaria').addEventListener('click', calcularDistribucionEstacionaria);
document.getElementById('calcularProbabilidad').addEventListener('click', calcularProbabilidad);
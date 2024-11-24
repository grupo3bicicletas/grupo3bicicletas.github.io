// Variables globales
let bicicletasData = [];
let matrizTransicion = [];
let estaciones = [];

// Función para generar la matriz de bicicletas
function generarMatriz() {
    const numEstaciones = parseInt(document.getElementById('numEstaciones').value);
    const numBicicletas = parseInt(document.getElementById('numBicicletas').value);
    const numDias = parseInt(document.getElementById('numDias').value);

    // Definir las estaciones
    estaciones = Array.from({ length: numEstaciones }, (_, i) => `E${i + 1}`);

    // Crear la matriz de bicicletas (cada bicicleta tiene una lista de estaciones visitadas por día)
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

    let resultado = '';
    // Mostrar las bicicletas y las estaciones visitadas por día
    bicicletasData.forEach((bicicleta, index) => {
        resultado += `B${index + 1}: ${bicicleta.join(', ')}\n`;
    });

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

    // Normalizar las columnas de la matriz de transición
    matrizTransicion = matrizTransicion.map(col =>
        col.map(val => val / (col.reduce((acc, x) => acc + x, 0) || 1))
    );

    let resultado = '';
    // Mostrar la matriz de transición
    matrizTransicion.forEach((fila, index) => {
        resultado += `De ${estaciones[index]}: ${fila.map(v => v.toFixed(2)).join(', ')}\n`;
    });

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

    let resultado = '';
    // Mostrar la distribución estacionaria
    estaciones.forEach((estacion, index) => {
        resultado += `${estacion}: ${vector[index].toFixed(4)}\n`;
    });

    document.getElementById('resultados').innerHTML = `<pre>${resultado}</pre>`;
}

// Eventos
document.getElementById('generarMatriz').addEventListener('click', generarMatriz);
document.getElementById('verMatriz').addEventListener('click', mostrarMatrizBicicletas);
document.getElementById('verMatrizTransicion').addEventListener('click', calcularMatrizTransicion);
document.getElementById('verDistribucionEstacionaria').addEventListener('click', calcularDistribucionEstacionaria);

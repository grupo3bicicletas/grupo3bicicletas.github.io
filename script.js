// Variables globales
let bicicletasData = [];
let matrizTransicion = [];
let estaciones = [];

// Generar matriz de bicicletas
function generarMatriz() {
    const numEstaciones = parseInt(document.getElementById('numEstaciones').value);
    const numBicicletas = parseInt(document.getElementById('numBicicletas').value);
    const numDias = parseInt(document.getElementById('numDias').value);

    if (numEstaciones < 2 || numBicicletas < 1 || numDias < 1) {
        alert("Por favor, verifica los valores ingresados.");
        return;
    }

    estaciones = Array.from({ length: numEstaciones }, (_, i) => `E${i + 1}`);
    bicicletasData = Array.from({ length: numBicicletas }, () =>
        Array.from({ length: numDias }, () => estaciones[Math.floor(Math.random() * numEstaciones)])
    );

    document.getElementById('resultados').innerHTML = '<p>Matriz generada correctamente.</p>';
}

// Mostrar matriz de bicicletas
function mostrarMatrizBicicletas() {
    if (!bicicletasData.length) {
        alert("Primero genera la matriz de bicicletas.");
        return;
    }

    const resultado = bicicletasData
        .map((bicicleta, index) => `B${index + 1}: ${bicicleta.join(', ')}`)
        .join('\n');

    document.getElementById('resultados').innerHTML = `<pre>${resultado}</pre>`;
}

// Calcular matriz de transición
function calcularMatrizTransicion() {
    if (!bicicletasData.length) {
        alert("Primero genera la matriz de bicicletas.");
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

    matrizTransicion = matrizTransicion.map(fila => {
        const suma = fila.reduce((acc, val) => acc + val, 0);
        return fila.map(val => (suma === 0 ? 0 : val / suma));
    });

    const resultado = matrizTransicion
        .map((fila, index) => `De ${estaciones[index]}: ${fila.map(v => v.toFixed(2)).join(', ')}`)
        .join('\n');

    document.getElementById('resultados').innerHTML = `<pre>${resultado}</pre>`;
}

// Calcular distribución estacionaria
function calcularDistribucionEstacionaria() {
    if (!matrizTransicion.length) {
        alert("Primero calcula la matriz de transición.");
        return;
    }

    const numEstaciones = estaciones.length;
    let vector = Array(numEstaciones).fill(1 / numEstaciones);

    for (let iter = 0; iter < 100; iter++) {
        vector = matrizTransicion[0].map((_, colIndex) =>
            matrizTransicion.reduce((sum, fila, rowIndex) => sum + fila[colIndex] * vector[rowIndex], 0)
        );
    }

    const resultado = estaciones
        .map((estacion, index) => `${estacion}: ${vector[index].toFixed(4)}`)
        .join('\n');

    document.getElementById('resultados').innerHTML = `<pre>${resultado}</pre>`;
}

// Eventos
document.getElementById('generarMatriz').addEventListener('click', generarMatriz);
document.getElementById('verMatriz').addEventListener('click', mostrarMatrizBicicletas);
document.getElementById('verMatrizTransicion').addEventListener('click', calcularMatrizTransicion);
document.getElementById('verDistribucionEstacionaria').addEventListener('click', calcularDistribucionEstacionaria);
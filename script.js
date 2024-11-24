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

    matrizTransicion = matrizTransicion.map((fila, index) => 
        `De ${estaciones[index]}: ${fila.map((v) => v.toFixed(2)).join(', ')}`
    ).join('\n');

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

// Manejo del evento para seleccionar la opción y ejecutar la función correspondiente
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
        default:
            alert('Por favor, selecciona una opción válida.');
    }
});
// Variables globales
let bicicletasData = [];
let matrizTransicion = [];
let estaciones = [];
let distribucionEstacionaria = [];

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

    let resultado = '';
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

    matrizTransicion = matrizTransicion.map(col =>
        col.map(val => val / (col.reduce((acc, x) => acc + x, 0) || 1))
    );

    let resultado = '';
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
    estaciones.forEach((estacion, index) => {
        resultado += `${estacion}: ${vector[index].toFixed(4)}\n`;
    });

    document.getElementById('resultados').innerHTML = `<pre>${resultado}</pre>`;
}

// Función para calcular la probabilidad de una bicicleta en una estación dada
function calcularProbabilidad() {
    if (!bicicletasData.length) {
        alert('Primero genera la matriz de bicicletas.');
        return;
    }

    const probabilidad = bicicletasData.reduce((acc, bicicleta) => {
        bicicleta.forEach((estacion) => {
            const index = estaciones.indexOf(estacion);
            if (index !== -1) acc[index]++;
        });
        return acc;
    }, Array(estaciones.length).fill(0));

    let resultado = '';
    probabilidad.forEach((count, index) => {
        resultado += `${estaciones[index]}: ${(count / bicicletasData.length).toFixed(4)}\n`;
    });

    document.getElementById('resultados').innerHTML = `<pre>${resultado}</pre>`;
}

// Función para calcular la matriz estacionaria
function calcularMatrizEstacionaria() {
    if (!matrizTransicion.length) {
        alert('Primero calcula la matriz de transición.');
        return;
    }

    let estacionaria = Array(estaciones.length).fill(1 / estaciones.length);

    // Iterar para encontrar la distribución estacionaria
    for (let i = 0; i < 1000; i++) {
        estacionaria = estacionaria.map((_, index) => {
            return matrizTransicion[index].reduce((sum, value, idx) => {
                return sum + value * estacionaria[idx];
            }, 0);
        });
    }

    let resultado = estacionaria
        .map((val, index) => `${estaciones[index]}: ${val.toFixed(4)}`)
        .join('\n');

    document.getElementById('resultados').innerHTML = `<pre>${resultado}</pre>`;
}

// Función para calcular las transiciones entre estaciones
function calcularTransiciones() {
    if (!bicicletasData.length) {
        alert('Primero genera la matriz de bicicletas.');
        return;
    }

    let transiciones = {};
    bicicletasData.forEach((bicicleta) => {
        for (let i = 0; i < bicicleta.length - 1; i++) {
            const key = `${bicicleta[i]}->${bicicleta[i + 1]}`;
            transiciones[key] = (transiciones[key] || 0) + 1;
        }
    });

    let resultado = '';
    Object.keys(transiciones).forEach((key) => {
        resultado += `${key}: ${transiciones[key]}\n`;
    });

    document.getElementById('resultados').innerHTML = `<pre>${resultado}</pre>`;
}

// Manejo del evento para seleccionar la opción y ejecutar la función correspondiente
document.getElementById('ejecutarOpcion').addEventListener('click', () => {
    const opcion = document.getElementById('selectorOpciones').value;
    switch (opcion) {
        case 'mostrarMatriz':
            mostrarMatrizBicicletas();
            break;
        case 'calcularTransicion':
            calcularMatrizTransicion();
            break;
        case 'calcularDistribucion':
            calcularDistribucionEstacionaria();
            break;
        case 'calcularProbabilidad':
            calcularProbabilidad();
            break;
        case 'calcularMatrizEstacionaria':
            calcularMatrizEstacionaria();
            break;
        case 'calcularTransiciones':
            calcularTransiciones();
            break;
        default:
            alert('Por favor, selecciona una opción válida.');
    }
});
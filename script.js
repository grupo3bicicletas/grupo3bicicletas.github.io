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

// Función para consultar estación de una bicicleta en un día específico
function consultarEstacion() {
    const bicicletaId = prompt("Introduce el ID de la bicicleta (ej. B1, B2, etc.):");
    const dia = parseInt(prompt("Introduce el día (1, 2, ..., n):")) - 1;

    if (!bicicletasData.length) {
        alert('Primero genera la matriz de bicicletas.');
        return;
    }

    const bicicleta = bicicletasData[parseInt(bicicletaId.replace('B', '')) - 1];
    const estacion = bicicleta[dia];
    document.getElementById('resultados').innerHTML = `<p>Bicicleta ${bicicletaId} está en la estación ${estacion} en el día ${dia + 1}.</p>`;
}

// Función para calcular la probabilidad de ir de una estación a otra
function calcularProbabilidad() {
    const origen = prompt("Introduce la estación de origen:");
    const destino = prompt("Introduce la estación de destino:");
    const dias = parseInt(prompt("Introduce el número de días:"));

    const origenIdx = estaciones.indexOf(origen);
    const destinoIdx = estaciones.indexOf(destino);

    if (origenIdx === -1 || destinoIdx === -1) {
        alert("Estación no válida.");
        return;
    }

    let probabilidad = matrizTransicion[origenIdx][destinoIdx];
    document.getElementById('resultados').innerHTML = `<p>La probabilidad de ir de ${origen} a ${destino} en ${dias} días es: ${probabilidad.toFixed(2)}</p>`;
}

// Función para calcular probabilidad con vector personalizado
function calcularProbabilidadVector() {
    // Implementar según necesidad
}

// Manejo de selección de opciones en el menú
document.getElementById('menuOpciones').addEventListener('change', function (e) {
    switch (e.target.value) {
        case "Configurar número de bicicletas, días y estaciones":
            document.getElementById('generarMatriz').style.display = 'block';
            break;
        case "Generar nueva matriz de bicicletas":
            generarMatriz();
            break;
        case "Mostrar matriz completa de bicicletas":
            mostrarMatrizBicicletas();
            break;
        case "Consultar estación de una bicicleta en un día específico":
            consultarEstacion();
            break;
        case "Mostrar matriz de transición":
            calcularMatrizTransicion();
            break;
        case "Calcular probabilidad de ir de una estación a otra en 'n' días":
            calcularProbabilidad();
            break;
        case "Calcular probabilidad con vector personalizado":
            calcularProbabilidadVector();
            break;
        case "Calcular distribución estacionaria":
            calcularDistribucionEstacionaria();
            break;
    }
});
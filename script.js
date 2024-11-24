// Variables globales
let bicicletasData = [];
let matrizTransicion = [];
let estaciones = [];

// Manejo de selección de opciones en el menú
document.getElementById('menuOpciones').addEventListener('change', function (e) {
    // Limpiar los resultados antes de mostrar nuevos resultados
    document.getElementById('resultados').innerHTML = '';

    switch (e.target.value) {
        case "Configurar número de bicicletas, días y estaciones":
            document.getElementById('configuracionMatriz').style.display = 'block';
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
        default:
            document.getElementById('configuracionMatriz').style.display = 'none';
            break;
    }
});

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

// Función para mostrar la matriz completa de bicicletas
function mostrarMatrizBicicletas() {
    if (!bicicletasData.length) {
        alert('Primero genera la matriz de bicicletas.');
        return;
    }

    const resultado = bicicletasData
        .map((bicicleta, index) => `Bicicleta ${index + 1}: ${bicicleta.join(', ')}`)
        .join('<br>');

    document.getElementById('resultados').innerHTML = `<pre>${resultado}</pre>`;
}

// Función para consultar la estación de una bicicleta en un día específico
function consultarEstacion() {
    const biciId = prompt('Ingresa el número de la bicicleta (1, 2, 3...):');
    const dia = prompt('Ingresa el día (1, 2, 3...):');

    const bicicleta = bicicletasData[parseInt(biciId) - 1];
    if (bicicleta) {
        const estacion = bicicleta[parseInt(dia) - 1];
        document.getElementById('resultados').innerHTML = `Bicicleta ${biciId} en el día ${dia}: Estación ${estacion}`;
    } else {
        alert('Bicicleta no encontrada.');
    }
}

// Función para calcular la matriz de transición
function calcularMatrizTransicion() {
    let matriz = [];
    for (let i = 0; i < estaciones.length; i++) {
        matriz[i] = [];
        for (let j = 0; j < estaciones.length; j++) {
            let count = 0;
            for (let k = 0; k < bicicletasData.length; k++) {
                for (let l = 0; l < bicicletasData[k].length - 1; l++) {
                    if (bicicletasData[k][l] === estaciones[i] && bicicletasData[k][l + 1] === estaciones[j]) {
                        count++;
                    }
                }
            }
            matriz[i][j] = count;
        }
    }

    document.getElementById('resultados').innerHTML = `<pre>${JSON.stringify(matriz, null, 2)}</pre>`;
}

// Función para calcular la probabilidad de ir de una estación a otra en 'n' días
function calcularProbabilidad() {
    const estacionInicio = prompt('Ingresa la estación de inicio:');
    const estacionFin = prompt('Ingresa la estación de fin:');
    const dias = prompt('Ingresa el número de días:');

    document.getElementById('resultados').innerHTML = `Probabilidad de ir de ${estacionInicio} a ${estacionFin} en ${dias} días: X%`;
}

// Función para calcular la probabilidad con un vector personalizado
function calcularProbabilidadVector() {
    const vector = prompt('Ingresa el vector personalizado (por ejemplo: "0.5, 0.3, 0.2"):');
    const vectorArray = vector.split(',').map(Number);

    document.getElementById('resultados').innerHTML = `Probabilidad con el vector personalizado: X%`;
}

// Función para calcular la distribución estacionaria
function calcularDistribucionEstacionaria() {
    const distribucion = "X%"; // Lógica de distribución estacionaria aquí

    document.getElementById('resultados').innerHTML = `Distribución estacionaria: ${distribucion}`;
}
// Variables globales
let numBicicletas = 140;
let numEstaciones = 12;
let numDias = 30;
let estaciones = Array.from({ length: numEstaciones }, (_, i) => `E${i + 1}`);
let matrizBicicletas;

// Generar nueva matriz
function generarNuevaMatriz() {
    matrizBicicletas = Array.from({ length: numBicicletas }, () =>
        Array.from({ length: numDias }, () => estaciones[Math.floor(Math.random() * numEstaciones)])
    );
    alert("Matriz de bicicletas generada correctamente.");
}

// Mostrar matriz completa
function mostrarMatriz() {
    if (!matrizBicicletas) {
        alert("Primero genera una matriz.");
        return;
    }
    const resultado = matrizBicicletas
        .map((bicicleta, index) => `B${index + 1}: ${bicicleta.join(", ")}`)
        .join("<br>");
    document.getElementById("matrizCompleta").innerHTML = `<pre>${resultado}</pre>`;
}

// Consultar estación de una bicicleta en un día
function consultarEstacion(event) {
    event.preventDefault();
    if (!matrizBicicletas) {
        alert("Primero genera una matriz.");
        return;
    }
    const dia = parseInt(document.getElementById("dia").value) - 1;
    const bicicleta = parseInt(document.getElementById("bicicleta").value) - 1;

    if (dia < 0 || dia >= numDias || bicicleta < 0 || bicicleta >= numBicicletas) {
        alert("Día o bicicleta fuera de rango.");
        return;
    }

    const estacion = matrizBicicletas[bicicleta][dia];
    document.getElementById("resultadoConsulta").textContent = `El día ${dia + 1}, la bicicleta B${bicicleta + 1} estuvo en la estación ${estacion}.`;
}

// Calcular matriz de transición
function calcularMatrizTransicion() {
    const transiciones = Array.from({ length: numEstaciones }, () => Array(numEstaciones).fill(0));

    matrizBicicletas.forEach((bicicleta) => {
        for (let i = 0; i < numDias - 1; i++) {
            const estacionActual = estaciones.indexOf(bicicleta[i]);
            const estacionSiguiente = estaciones.indexOf(bicicleta[i + 1]);
            transiciones[estacionActual][estacionSiguiente]++;
        }
    });

    return transiciones.map((fila) => {
        const total = fila.reduce((a, b) => a + b, 0);
        return fila.map((valor) => (total > 0 ? valor / total : 1 / numEstaciones));
    });
}

function mostrarMatrizTransicion() {
    const matrizTransicion = calcularMatrizTransicion();
    const resultado = matrizTransicion
        .map((fila, i) => `E${i + 1}: ${fila.map((v) => v.toFixed(2)).join(", ")}`)
        .join("<br>");
    document.getElementById("matrizTransicion").innerHTML = `<pre>${resultado}</pre>`;
}

// Calcular probabilidad de transición
function calcularProbabilidad(event) {
    event.preventDefault();
    const estacionInicial = document.getElementById("estacionInicial").value;
    const estacionFinal = document.getElementById("estacionFinal").value;
    const nDias = parseInt(document.getElementById("nDias").value);

    const matrizTransicion = calcularMatrizTransicion();
    let estado = Array(numEstaciones).fill(0);
    estado[estaciones.indexOf(estacionInicial)] = 1;

    for (let i = 0; i < nDias; i++) {
        estado = estado.map((_, j) =>
            estado.reduce((sum, prob, k) => sum + prob * matrizTransicion[k][j], 0)
        );
    }

    const probabilidad = estado[estaciones.indexOf(estacionFinal)].toFixed(4);
    document.getElementById("resultadoProbabilidad").textContent = `La probabilidad de ir de ${estacionInicial} a ${estacionFinal} en ${nDias} días es ${probabilidad}.`;
}

// Calcular distribución estacionaria
function calcularDistribucionEstacionaria() {
    const matrizTransicion = calcularMatrizTransicion();
    let estado = Array(numEstaciones).fill(1 / numEstaciones);

    for (let i = 0; i < 100; i++) {
        estado = estado.map((_, j) =>
            estado.reduce((sum, prob, k) => sum + prob * matrizTransicion[k][j], 0)
        );
    }

    const resultado = estaciones
        .map((estacion, i) => `${estacion}: ${estado[i].toFixed(4)}`)
        .join("<br>");
    document.getElementById("distribucionEstacionariaResultado").innerHTML = `<pre>${resultado}</pre>`;
}

// Mostrar opciones
function mostrarOpcion() {
    const opciones = document.querySelectorAll(".opcion");
    opciones.forEach((opcion) => (opcion.style.display = "none"));

    const seleccion = document.getElementById("menuOpciones").value;
    if (seleccion) {
        document.getElementById(seleccion).style.display = "block";
    }
}
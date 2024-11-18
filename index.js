// Variables globales
let bicicletas = 0;
let dias = 0;
let estaciones = 0;
let matrizBicicletas = [];
let matrizTransicion = [];

// Mostrar las opciones seleccionadas
function mostrarOpcion() {
    let opciones = document.querySelectorAll('.opcion');
    opciones.forEach(opcion => opcion.style.display = 'none');
    let seleccion = document.getElementById('menuOpciones').value;
    if (seleccion) {
        document.getElementById(seleccion).style.display = 'block';
    }
}

// Configurar los valores iniciales
function configurar() {
    bicicletas = parseInt(document.getElementById('bicicletas').value);
    dias = parseInt(document.getElementById('dias').value);
    estaciones = parseInt(document.getElementById('estaciones').value);

    if (bicicletas > 0 && dias > 0 && estaciones > 0) {
        document.getElementById("resultadoTexto").textContent = 
            `Configuración exitosa: ${bicicletas} bicicletas, ${dias} días, ${estaciones} estaciones.`;
    } else {
        document.getElementById("resultadoTexto").textContent = "Por favor, ingresa valores válidos.";
    }
}

// Generar una matriz aleatoria de movimientos de bicicletas
function generarMatriz() {
    if (bicicletas === 0 || dias === 0 || estaciones === 0) {
        document.getElementById("resultadoTexto").textContent = 
            "Primero configura el número de bicicletas, días y estaciones.";
        return;
    }

    matrizBicicletas = Array.from({ length: dias }, () => 
        Array.from({ length: bicicletas }, () => Math.floor(Math.random() * estaciones) + 1)
    );

    document.getElementById("resultadoTexto").textContent = "Matriz generada correctamente.";
}

// Mostrar la matriz completa de bicicletas
function mostrarMatriz() {
    if (matrizBicicletas.length === 0) {
        document.getElementById("resultadoTexto").textContent = 
            "La matriz aún no ha sido generada. Por favor, usa 'Generar Matriz'.";
        return;
    }

    let matrizTexto = matrizBicicletas.map((dia, index) => 
        `Día ${index + 1}: ${dia.join(", ")}`).join("\n");

    document.getElementById("resultadoTexto").textContent = matrizTexto;
}

// Consultar la estación de una bicicleta en un día específico
function consultarEstacion() {
    let dia = parseInt(document.getElementById('dia').value);
    let bicicleta = parseInt(document.getElementById('bicicleta').value);

    if (matrizBicicletas.length === 0) {
        document.getElementById("resultadoTexto").textContent = 
            "No hay datos. Genera primero la matriz.";
        return;
    }

    if (dia > 0 && dia <= dias && bicicleta > 0 && bicicleta <= bicicletas) {
        let estacion = matrizBicicletas[dia - 1][bicicleta - 1];
        document.getElementById("resultadoTexto").textContent = 
            `La bicicleta ${bicicleta} estuvo en la estación ${estacion} el día ${dia}.`;
    } else {
        document.getElementById("resultadoTexto").textContent = 
            "Por favor, ingresa un día y bicicleta válidos.";
    }
}

// Generar matriz de transición
function mostrarMatrizTransicion() {
    if (matrizBicicletas.length === 0) {
        document.getElementById("resultadoTexto").textContent = 
            "Primero genera la matriz de bicicletas.";
        return;
    }

    matrizTransicion = Array.from({ length: estaciones }, () => 
        Array(estaciones).fill(0));

    for (let dia = 1; dia < dias; dia++) {
        for (let bici = 0; bici < bicicletas; bici++) {
            let origen = matrizBicicletas[dia - 1][bici] - 1;
            let destino = matrizBicicletas[dia][bici] - 1;
            matrizTransicion[origen][destino]++;
        }
    }

    for (let i = 0; i < estaciones; i++) {
        let total = matrizTransicion[i].reduce((sum, val) => sum + val, 0);
        if (total > 0) {
            matrizTransicion[i] = matrizTransicion[i].map(val => val / total);
        }
    }

    let transicionTexto = matrizTransicion.map((fila, index) => 
        `Estación ${index + 1}: ${fila.map(val => val.toFixed(2)).join(", ")}`).join("\n");

    document.getElementById("resultadoTexto").textContent = transicionTexto;
}

// Calcular probabilidad de transición entre estaciones
function calcularProbabilidad() {
    let estacionInicial = parseInt(document.getElementById('estacion_inicial').value) - 1;
    let estacionFinal = parseInt(document.getElementById('estacion_final').value) - 1;
    let nDias = parseInt(document.getElementById('n_dias').value);

    if (!matrizTransicion.length) {
        document.getElementById("resultadoTexto").textContent = 
            "Primero genera la matriz de transición.";
        return;
    }

    let matrizPotencia = matrizTransicion;
    for (let n = 1; n < nDias; n++) {
        matrizPotencia = multiplicarMatrices(matrizPotencia, matrizTransicion);
    }

    let probabilidad = matrizPotencia[estacionInicial][estacionFinal];
    document.getElementById("resultadoTexto").textContent = 
        `La probabilidad de ir de la estación ${estacionInicial + 1} a la ${estacionFinal + 1} en ${nDias} días es ${probabilidad.toFixed(4)}.`;
}

// Multiplicación de matrices
function multiplicarMatrices(A, B) {
    return A.map((fila, i) => 
        B[0].map((_, j) => 
            fila.reduce((sum, val, k) => sum + val * B[k][j], 0)
        )
    );
}
// Variables globales
let bicicletasData = [];
let estaciones = [];

// Función para generar la matriz de bicicletas
function generarMatriz() {
    const numEstaciones = parseInt(document.getElementById('numEstaciones').value);
    const numBicicletas = parseInt(document.getElementById('numBicicletas').value);
    const numDias = parseInt(document.getElementById('numDias').value);

    if (numEstaciones < 2 || numBicicletas < 1 || numDias < 1) {
        alert("Por favor, ingresa valores válidos para generar la matriz.");
        return;
    }

    estaciones = Array.from({ length: numEstaciones }, (_, i) => `E${i + 1}`);
    bicicletasData = Array.from({ length: numDias }, () =>
        Array.from({ length: numBicicletas }, () => estaciones[Math.floor(Math.random() * numEstaciones)])
    );

    document.getElementById('resultados').innerHTML = '<p style="color: green;">Matriz generada correctamente.</p>';
}

// Función para mostrar la matriz de bicicletas en tabla
function mostrarMatrizBicicletas() {
    if (!bicicletasData.length) {
        alert("Primero debes generar la matriz de bicicletas.");
        return;
    }

    let tabla = `<table>
        <thead>
            <tr>
                <th>Día</th>${bicicletasData[0].map((_, i) => `<th>B${i + 1}</th>`).join('')}
            </tr>
        </thead>
        <tbody>`;

    bicicletasData.forEach((dia, index) => {
        tabla += `<tr>
            <td>Día ${index + 1}</td>${dia.map(estacion => `<td>${estacion}</td>`).join('')}
        </tr>`;
    });

    tabla += '</tbody></table>';

    document.getElementById('resultados').innerHTML = `
        <h3>Resultado:</h3>
        ${tabla}
    `;
}

// Eventos
document.getElementById('generarMatriz').addEventListener('click', generarMatriz);
document.getElementById('verMatriz').addEventListener('click', mostrarMatrizBicicletas);
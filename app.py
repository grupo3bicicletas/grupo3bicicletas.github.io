from flask import Flask, render_template, request
import random
import numpy as np
import pandas as pd
import os

app = Flask(__name__)

num_bicicletas = 140
num_estaciones = 12
num_dias = 30
estaciones = [f"E{i}" for i in range(1, num_estaciones + 1)]

def generar_matriz():
    bicicletas_estaciones = {}
    for bicicleta in range(1, num_bicicletas + 1):
        estaciones_por_dia = [random.choice(estaciones) for _ in range(num_dias)]
        bicicletas_estaciones[f"B{bicicleta}"] = estaciones_por_dia

    df_bicicletas = pd.DataFrame(bicicletas_estaciones)
    df_bicicletas.index = [f"Día {i+1}" for i in range(num_dias)]
    return df_bicicletas

def calcular_matriz_transicion(df_bicicletas):
    transiciones = {estacion: {e: 0 for e in estaciones} for estacion in estaciones}
    for bicicleta in df_bicicletas.columns:
        for dia in range(num_dias - 1):
            estacion_actual = df_bicicletas[bicicleta].iloc[dia]
            estacion_siguiente = df_bicicletas[bicicleta].iloc[dia + 1]
            transiciones[estacion_actual][estacion_siguiente] += 1

    matriz_transicion = pd.DataFrame(transiciones, dtype=float)

    # Normalización por columnas
    for estacion in matriz_transicion.columns:
        total_transiciones = matriz_transicion[estacion].sum()
        if total_transiciones > 0:
            matriz_transicion[estacion] = matriz_transicion[estacion] / total_transiciones
        else:
            matriz_transicion[estacion] = 1.0 / num_estaciones

    # Comprobación de que las columnas suman 1
    for col in matriz_transicion.columns:
        if not np.isclose(matriz_transicion[col].sum(), 1):
            raise ValueError(f"La columna {col} de la matriz de transición no está correctamente normalizada.")


    return matriz_transicion

def calcular_distribucion_estacionaria(matriz_transicion):
    matriz_transicion_np = matriz_transicion.to_numpy()

    valores_propios, vectores_propios = np.linalg.eig(matriz_transicion_np.T)

    indice_valor_propio_uno = np.isclose(valores_propios, 1)

    if not np.any(indice_valor_propio_uno):
        return None 

    vector_estacionario = vectores_propios[:, indice_valor_propio_uno].flatten().real
    vector_estacionario = vector_estacionario / vector_estacionario.sum()

    distribucion_estacionaria = pd.DataFrame(vector_estacionario, index=estaciones, columns=['Probabilidad'])
    
    return distribucion_estacionaria.round(4)

def probabilidad_ir_estacion_a_estacion(matriz_transicion, estacion_inicial, estacion_final, n_dias):
    matriz_transicion_np = matriz_transicion.to_numpy()

    if estacion_inicial not in estaciones or estacion_final not in estaciones:
        raise ValueError("Estación inicial o final no válida.")

    estado_inicial = np.zeros(len(estaciones))
    estado_inicial[estaciones.index(estacion_inicial)] = 1

    matriz_n_dias = np.linalg.matrix_power(matriz_transicion_np, n_dias)

    probabilidad = np.dot(estado_inicial, matriz_n_dias[:, estaciones.index(estacion_final)])

    return probabilidad

df_bicicletas_completa = generar_matriz()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/opcion', methods=['POST'])
def manejar_opcion():
    opcion = request.form.get('opcion')
    
    if opcion == '1':
        global df_bicicletas_completa
        df_bicicletas_completa = generar_matriz()
        return render_template('index.html', resultado="Nueva matriz generada.")
    
    elif opcion == '2':
        return render_template('index.html', resultado=df_bicicletas_completa.to_string())

    elif opcion == '3':
        dia = int(request.form.get('dia'))
        bicicleta = request.form.get('bicicleta')
        estacion = df_bicicletas_completa.loc[f'Día {dia}', f'B{bicicleta}']
        return render_template('index.html', resultado=f"El día {dia}, la bicicleta B{bicicleta} estuvo en la estación {estacion}.")
    
    elif opcion == '4':
        try:
            matriz_transicion = calcular_matriz_transicion(df_bicicletas_completa)
            return render_template('index.html', resultado=matriz_transicion.to_string())
        except ValueError as e:
            return render_template('index.html', resultado=f"Error: {str(e)}")
    
    elif opcion == '5':
        estacion_inicial = request.form.get('estacion_inicial')
        estacion_final = request.form.get('estacion_final')
        n_dias = int(request.form.get('n_dias'))
        try:
            probabilidad = probabilidad_ir_estacion_a_estacion(calcular_matriz_transicion(df_bicicletas_completa), estacion_inicial, estacion_final, n_dias)
            return render_template('index.html', resultado=f"La probabilidad de que una bicicleta pase de {estacion_inicial} a {estacion_final} en {n_dias} días es {probabilidad:.4f}.")
        except ValueError as e:
            return render_template('index.html', resultado=f"Error: {str(e)}")
    
    elif opcion == '6':
        try:
            matriz_transicion = calcular_matriz_transicion(df_bicicletas_completa)
            distribucion_estacionaria = calcular_distribucion_estacionaria(matriz_transicion)
            if distribucion_estacionaria is not None:
                return render_template('index.html', resultado=distribucion_estacionaria.to_string())
            else:
                return render_template('index.html', resultado="Error: No se pudo calcular el vector estacionario, resultado vacío.")
        except ValueError as e:
            return render_template('index.html', resultado=f"Error: {str(e)}")

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)

"""Entrena el modelo de severidad de siniestros viales (Random Forest).

Clasificación binaria:
    0 = SOLO DAÑOS
    1 = CON HERIDOS / CON MUERTOS

Limpieza de datos aplicada (ver comentarios en el código):
    - Se excluye GRAVEDAD = 'OTRO' (severidad desconocida).
    - El año se extrae de `fecha_hora` (el campo `anio` trae valores inválidos como 0 o
      20140); solo se aceptan años entre ANIO_MIN y ANIO_MAX.
    - Se excluyen ciudades con una sola clase de gravedad (p. ej. una fuente que solo
      registra heridos/muertos): con ellas, la ciudad delata la respuesta y el modelo
      aprende el origen de los datos en lugar de la severidad.
    - Se excluyen segmentos (ciudad, año) con casi una sola clase (p. ej. Medellín 2019 o
      Barranquilla desde 2023): es el mismo problema a nivel de periodo. Quitar la
      variable año no basta, porque esas filas seguirían en el entrenamiento y en el test.

El script entrena dos variantes sobre el MISMO split (con año y sin año) y las compara.
Se guarda la que indique USAR_ANIO.

Ejecutar desde la carpeta `backend`:
    python -m app.ml.train_model
"""
import sys
import unicodedata
from pathlib import Path

# Permite ejecutarlo también como `python app/ml/train_model.py`
BACKEND_DIR = Path(__file__).resolve().parents[2]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

import joblib
import pandas as pd
from pymongo.errors import PyMongoError
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder

from app.database.mongo_client import mongo_db

MODELS_DIR = Path(__file__).resolve().parent / "models"
SAMPLE_SIZE = 50000
ANIO_MIN = 2000
ANIO_MAX = 2030

# Segmentos (ciudad, año) con casi una sola clase de gravedad (tasa de graves >= UMBRAL o
# <= 1 - UMBRAL) y al menos MIN_REGISTROS registros: se descartan. El mínimo evita eliminar
# segmentos pequeños que salgan "puros" solo por azar.
UMBRAL_SEGMENTO = 0.97
MIN_REGISTROS_SEGMENTO = 30

# Qué variante se guarda en disco: True = con año, False = sin año.
# El año arrastra cambios de registro en los datos (2019 y 2023+), por eso va en False.
USAR_ANIO = False
# Ojo: "balanced" pondera MÁS la clase minoritaria, y aquí la minoritaria es "solo daños"
# (~43 %), así que empeora el recall de los casos graves. Déjalo en None.
CLASS_WEIGHT = None


def gravedad_a_target(valor):
    """Devuelve 0 (solo daños), 1 (heridos/muertos) o None (OTRO / desconocido).

    Se normalizan las tildes y la Ñ para que 'SOLO DAÑOS' y 'SOLO DANOS' coincidan.
    """
    v = unicodedata.normalize("NFKD", str(valor)).encode("ascii", "ignore").decode().upper()
    if "DANOS" in v:
        return 0
    if "HERIDOS" in v or "MUERTOS" in v:
        return 1
    return None


def train_severity_model():
    print("📥 Extrayendo datos de MongoDB para entrenamiento...")

    # Muestra ALEATORIA de registros con gravedad conocida y año válido.
    # Con limit() se tomarían solo los primeros documentos (ordenados por año).
    try:
        siniestros = mongo_db.get_collection("siniestros")
        pipeline = [
            # El campo `anio` trae valores inválidos (0, 20140, 20150...), así que el
            # año se extrae de los primeros 4 caracteres de `fecha_hora`.
            {
                "$addFields": {
                    "anio_fecha": {
                        "$convert": {
                            "input": {"$substrCP": [{"$toString": "$fecha_hora"}, 0, 4]},
                            "to": "int",
                            "onError": None,
                            "onNull": None,
                        }
                    }
                }
            },
            {
                "$match": {
                    "gravedad": {"$ne": "OTRO"},
                    "anio_fecha": {"$gte": ANIO_MIN, "$lte": ANIO_MAX},
                }
            },
            {
                "$project": {
                    "_id": 0,
                    "clase_accidente": 1,
                    "ciudad": 1,
                    "anio_fecha": 1,
                    "gravedad": 1,
                }
            },
            {"$sample": {"size": SAMPLE_SIZE}},
        ]
        df = pd.DataFrame(list(siniestros.aggregate(pipeline, allowDiskUse=True)))
    except PyMongoError as e:
        print(f"❌ Error consultando MongoDB: {e}")
        return

    if df.empty:
        print("❌ No se encontraron datos en la colección 'siniestros' para entrenar.")
        return

    # Nombres internos del modelo (los campos de Mongo están en minúscula)
    df = df.rename(
        columns={
            "clase_accidente": "CLASE",
            "ciudad": "CIUDAD",
            "anio_fecha": "A_O",
            "gravedad": "GRAVEDAD",
        }
    )
    df = df.dropna()

    df["TARGET"] = df["GRAVEDAD"].apply(gravedad_a_target)
    df = df.dropna(subset=["TARGET"])
    df["TARGET"] = df["TARGET"].astype(int)

    # Ciudades con una sola clase: no hay nada que aprender dentro de ellas y
    # la ciudad se vuelve un atajo para adivinar la gravedad.
    clases_por_ciudad = df.groupby("CIUDAD")["TARGET"].nunique()
    ciudades_una_clase = clases_por_ciudad[clases_por_ciudad < 2].index.tolist()
    if ciudades_una_clase:
        excluidos = int(df["CIUDAD"].isin(ciudades_una_clase).sum())
        print(f"⚠️  Ciudades excluidas por tener una sola clase de gravedad: {ciudades_una_clase} ({excluidos} registros)")
        df = df[~df["CIUDAD"].isin(ciudades_una_clase)].copy()

    # Segmentos (ciudad, año) con casi una sola clase: el mismo problema que las ciudades,
    # pero a nivel de periodo. En Medellín 2019 y en Barranquilla/Bucaramanga desde 2023
    # casi todo es grave (frente a 30-60 % en los años vecinos): cambió cómo se registra la
    # fuente, no la severidad real. Se descartan ANTES del split para que no contaminen
    # ni el entrenamiento ni el test (quitar solo la variable año no las saca de los datos).
    grupo = df.groupby(["CIUDAD", "A_O"])["TARGET"]
    tasa_segmento = grupo.transform("mean")
    n_segmento = grupo.transform("count")
    es_sesgado = (n_segmento >= MIN_REGISTROS_SEGMENTO) & (
        (tasa_segmento >= UMBRAL_SEGMENTO) | (tasa_segmento <= 1 - UMBRAL_SEGMENTO)
    )
    if es_sesgado.any():
        resumen = df[es_sesgado].groupby(["CIUDAD", "A_O"])["TARGET"].agg(["mean", "count"]).round(3)
        print(f"⚠️  Segmentos (ciudad, año) excluidos por casi una sola clase de gravedad ({int(es_sesgado.sum())} registros):")
        print(resumen.to_string())
        df = df[~es_sesgado].copy()

    if df.empty or df["TARGET"].nunique() < 2:
        print("❌ Tras la limpieza no quedan datos con ambas clases; revisa la colección.")
        return

    print(f"📊 Registros usados: {len(df)}")
    print("📊 Valores de GRAVEDAD encontrados:")
    print(df["GRAVEDAD"].value_counts().to_string())
    print("📊 Distribución del TARGET (0 = solo daños, 1 = con heridos/muertos):")
    print(df["TARGET"].value_counts(normalize=True).round(3).to_string())

    # Proporción de casos graves (mean) y cantidad de registros (count) por grupo
    print("📊 Proporción de casos graves por ciudad:")
    print(df.groupby("CIUDAD")["TARGET"].agg(["mean", "count"]).round(3).sort_values("mean"))
    print("📊 Proporción de casos graves por año:")
    print(df.groupby("A_O")["TARGET"].agg(["mean", "count"]).round(3))
    print("📊 Proporción de casos graves por año y ciudad:")
    print(df.pivot_table(index="A_O", columns="CIUDAD", values="TARGET", aggfunc="mean").round(2).to_string())
    print("📊 Registros por año y ciudad:")
    print(df.pivot_table(index="A_O", columns="CIUDAD", values="TARGET", aggfunc="count", fill_value=0).to_string())
    print("📊 Proporción de casos graves por clase de accidente:")
    print(df.groupby("CLASE")["TARGET"].agg(["mean", "count"]).round(3).sort_values("count", ascending=False).to_string())
    # Con solo CLASE y CIUDAD, el Random Forest aprende en la práctica la clase mayoritaria
    # de cada celda: las celdas grandes con tasa cercana a 0.5 son las que limitan la precisión.
    print("📊 Celdas (clase × ciudad) más grandes:")
    print(df.groupby(["CLASE", "CIUDAD"])["TARGET"].agg(["mean", "count"]).round(3).sort_values("count", ascending=False).head(10).to_string())

    le_clase = LabelEncoder()
    le_ciudad = LabelEncoder()

    df["CLASE_ENC"] = le_clase.fit_transform(df["CLASE"])
    df["CIUDAD_ENC"] = le_ciudad.fit_transform(df["CIUDAD"])

    # Un solo split para comparar las variantes en igualdad de condiciones
    train_idx, test_idx = train_test_split(
        df.index, test_size=0.2, random_state=42, stratify=df["TARGET"]
    )
    y_train = df.loc[train_idx, "TARGET"]
    y_test = df.loc[test_idx, "TARGET"]

    baseline = y_test.value_counts(normalize=True).max()
    print(f"ℹ️  Línea base (predecir siempre la clase mayoritaria): {baseline * 100:.2f}%")

    variantes = {
        "con año": ["CLASE_ENC", "CIUDAD_ENC", "A_O"],
        "sin año": ["CLASE_ENC", "CIUDAD_ENC"],
    }
    modelos = {}

    for nombre, columnas in variantes.items():
        print(f"\n🤖 Entrenando Random Forest ({nombre}, class_weight={CLASS_WEIGHT})...")
        modelo = RandomForestClassifier(
            n_estimators=100, random_state=42, class_weight=CLASS_WEIGHT
        )
        modelo.fit(df.loc[train_idx, columnas], y_train)

        y_pred = modelo.predict(df.loc[test_idx, columnas])
        accuracy = (y_pred == y_test.values).mean()
        print(f"✅ [{nombre}] Precisión (Accuracy): {accuracy * 100:.2f}%")
        print(classification_report(y_test, y_pred, target_names=["Solo daños", "Heridos/muertos"]))
        importancias = {c: float(v) for c, v in zip(columnas, modelo.feature_importances_.round(3))}
        print(f"[{nombre}] Importancia de variables:", importancias)

        modelos[nombre] = modelo

    nombre_guardado = "con año" if USAR_ANIO else "sin año"
    model = modelos[nombre_guardado]

    MODELS_DIR.mkdir(parents=True, exist_ok=True)
    joblib.dump(model, MODELS_DIR / "severity_model.pkl")
    joblib.dump(le_clase, MODELS_DIR / "le_clase.pkl")
    joblib.dump(le_ciudad, MODELS_DIR / "le_ciudad.pkl")
    print(f"\n💾 Modelo '{nombre_guardado}' y codificadores guardados en {MODELS_DIR}")
    print(f"   Variables del modelo guardado: {list(model.feature_names_in_)}")


if __name__ == "__main__":
    train_severity_model()
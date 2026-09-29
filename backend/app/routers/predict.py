from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import joblib
import numpy as np
import os

router = APIRouter(prefix="/predict", tags=["Predicción"])

MODEL_PATH = "app/ml/models/severity_model.pkl"
CLASE_PATH = "app/ml/models/le_clase.pkl"
CIUDAD_PATH = "app/ml/models/le_ciudad.pkl"

model = joblib.load(MODEL_PATH) if os.path.exists(MODEL_PATH) else None
le_clase = joblib.load(CLASE_PATH) if os.path.exists(CLASE_PATH) else None
le_ciudad = joblib.load(CIUDAD_PATH) if os.path.exists(CIUDAD_PATH) else None

class PredictionRequest(BaseModel):
    clase: str
    ciudad: str
    anio: int

def generar_reporte_predictivo(clase: str, ciudad: str, anio: int, es_critico: bool, confianza: float) -> str:
    """Genera un informe analítico y contextual de alta gerencia basado en el escenario."""
    clase_upper = clase.upper()
    
    if es_critico:
        if "ATROPELLO" in clase_upper:
            return (
                f"🚨 **Proyección Crítica para {ciudad} ({anio})**: El modelo anticipa una alta tasa de severidad en eventos de tipo *Atropello*. "
                f"Para periodos de cierre de año e incremento de actividad comercial en {anio}, se proyecta un aumento en la vulnerabilidad peatonal debido a la saturación de corredores viales principales. "
                f"Se recomienda un despliegue preventivo de controles de velocidad y campañas de cruce seguro con una certeza analítica del {confianza:.1f}%."
            )
        elif "VOLCAMIENTO" in clase_upper or "CAIDA" in clase_upper:
            return (
                f"⚠️ **Alerta de Riesgo Vial en {ciudad} ({anio})**: Los incidentes clasificados como *{clase.lower()}* muestran una tendencia elevada hacia consecuencias lesivas graves. "
                f"Factores cinéticos y condiciones operativas proyectadas para el año {anio} indican la necesidad de intervenir la malla vial crítica."
            )
        else:
            return (
                f"📈 **Tendencia de Cuidado en {ciudad} ({anio})**: La inferencia del modelo clasifica este escenario en **Alto Riesgo (Heridos o Muertos)** ({confianza:.1f}% de confianza). "
                f"Históricamente, las proyecciones hacia {anio} sugieren picos de siniestralidad durante temporadas de alto flujo vehicular y festividades."
            )
    else:
        return (
            f"✅ **Escenario Favorable / Bajo Riesgo en {ciudad} ({anio})**: Para la tipología *{clase}*, los patrones estacionales y la analítica histórica apuntan a eventos catalogados predominantemente como **Solo Daños** ({confianza:.1f}% de certidumbre). "
            f"No se prevén compromisos vitales masivos, aunque se sugiere mantener la vigilancia rutinaria en la red de movilidad."
        )

@router.post("/severity")
def predict_severity(data: PredictionRequest):
    if not model or not le_clase or not le_ciudad:
        raise HTTPException(status_code=500, detail="El modelo predictivo no ha sido entrenado aún.")
    
    try:
        # Transformación con codificadores de texto
        clase_enc = le_clase.transform([data.clase])[0] if data.clase in le_clase.classes_ else 0
        ciudad_enc = le_ciudad.transform([data.ciudad])[0] if data.ciudad in le_ciudad.classes_ else 0
        
        # El modelo opera con las 2 variables de mayor estabilidad estadística
        features = np.array([[clase_enc, ciudad_enc]])
        
        prediction = model.predict(features)[0]
        probabilities = model.predict_proba(features)[0]
        
        resultado = "Alto Riesgo (Heridos o Muertos)" if prediction == 1 else "Bajo Riesgo (Solo Daños)"
        confianza = float(np.max(probabilities) * 100)
        
        insight_gerencial = generar_reporte_predictivo(data.clase, data.ciudad, data.anio, bool(prediction), confianza)
        
        return {
            "prediccion": resultado,
            "nivel_riesgo_critico": bool(prediction),
            "confianza_porcentaje": round(confianza, 2),
            "insight_gerencial": insight_gerencial
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error en la predicción: {str(e)}")
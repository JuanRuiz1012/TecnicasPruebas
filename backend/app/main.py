from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth_router, dashboard_router, predict

app = FastAPI(
    title="API Gerencial - Análisis de Siniestralidad Vial",
    description="Backend FastAPI + MongoDB + ML para Dashboard BI",
    version="1.0.0"
)

# Permitir conexiones desde React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # En producción cambiar por la URL de React
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registrar las rutas en la aplicación
app.include_router(auth_router.router)
app.include_router(dashboard_router.router)
app.include_router(predict.router, prefix="/api/v1")

@app.get("/")
def home():
    return {
        "sistema": "BI Siniestralidad Vial - Activo",
        "documentacion": "/docs"
    }
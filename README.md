# AccidentAPP

Aplicación web de inteligencia de negocios para analizar la siniestralidad vial en ciudades de Colombia.
Integra 1.194.608 registros de datos abiertos (2012–2026) de Bogotá, Medellín, Envigado, Bucaramanga,
Barranquilla y un consolidado nacional, almacenados en MongoDB. Ofrece un dashboard descriptivo con
indicadores, gráficas y filtros, y un módulo de Machine Learning (Random Forest) que estima la gravedad
de un siniestro. El acceso es por roles: administrador, analista y ciudadano.

## Integrantes

- Jhorman Ricardo Loaiza Tellez
- Juan Felipe Ruiz López
- Mauricio Alejandro Rojas Cárdenas
- Mariana de los Ángeles Viera Serna

## Ejecución

Requisitos: Python 3.12+, Node.js 20+ y MongoDB en `mongodb://localhost:27017/`.

### Backend

```powershell
cd backend
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload
```

API en `http://127.0.0.1:8000` y documentación en `http://127.0.0.1:8000/docs`.

### Frontend

En otra terminal, desde la raíz del proyecto:

```powershell
cd frontend
npm install
npm run dev
```

La aplicación queda en `http://localhost:5173`.

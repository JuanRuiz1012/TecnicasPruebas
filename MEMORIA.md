# MEMORIA DEL PROYECTO — AccidentAPP

Registro vivo del proyecto. Actualizar al cierre de cada sesión de trabajo.

## 1. Descripción

Dashboard gerencial de **siniestralidad vial** para la Universidad del Valle.
Analiza más de 1.1 millones de registros de accidentes de tránsito almacenados en
MongoDB, ofrece un dashboard descriptivo (10 KPIs + 5 gráficas) y un módulo
predictivo de severidad basado en Machine Learning (Random Forest).

## 2. Estado actual

| Componente | Estado |
|---|---|
| Backend FastAPI | Funcional: autenticación JWT, dashboard descriptivo, predicción |
| Base de datos MongoDB | Requerida local (`db_siniestralidad_vial`, colecciones `siniestros` y `usuarios`) |
| Modelo ML | Entrenado y guardado en `backend/app/ml/models/` |
| Frontend React | Funcional: login, tema claro/oscuro, grid redimensionable, filtros |
| Analítica predictiva (`/dashboard/predictive`) | Devuelve datos de ejemplo (pendiente conectar a datos reales) |
| Pruebas automatizadas | No hay |

## 3. Arquitectura

```
React (Vite)  --HTTP/JWT-->  FastAPI  -->  MongoDB
                                |
                                +--> scikit-learn (Random Forest .pkl)
```

- `frontend`: SPA React 19 + Vite + TailwindCSS 4 + Recharts + react-grid-layout.
- `backend`: FastAPI con capas `routers -> services -> repositories -> database`.
- Autenticación: OAuth2 password flow, JWT HS256, expiración 60 min.
- Roles: `admin`, `analista`, `ciudadano` (el ciudadano no puede ver predicciones).

## 4. Estructura

```
backend/
  app/
    config.py                 Configuración (Mongo URI, JWT)
    core/security.py          Hash bcrypt + creación/validación de JWT
    database/mongo_client.py  Cliente MongoDB (singleton)
    models/                   Pydantic: filtros, usuarios, dashboard
    repositories/             Acceso a MongoDB (siniestros, usuarios)
    routers/                  auth_router, dashboard_router, predict
    services/                 Lógica de auth, dashboard y ML
    ml/train_model.py         Entrenamiento del modelo de severidad
    ml/models/*.pkl           Modelo y LabelEncoders serializados
  requirements.txt
frontend/
  src/
    App.jsx                   Login + layout del dashboard
    components/common/        Card, CustomTooltip
    components/dashboard/     KPIs, gráficas, filtros, predictor, grid
    hooks/                    useDashboardData, useTheme
    services/                 api.js, authService.js
Diagnostico.ipynb             Análisis exploratorio de datos
```

## 5. API

Base: `http://127.0.0.1:8000` — documentación interactiva en `/docs`.

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/` | No | Estado del servicio |
| POST | `/api/v1/auth/token` | No | Login (form-urlencoded) → JWT + rol |
| POST | `/api/v1/auth/setup-inicial` | No | Crea los 3 usuarios de prueba (temporal) |
| POST | `/api/v1/dashboard/descriptive` | JWT | 10 KPIs + 5 gráficas descriptivas |
| POST | `/api/v1/dashboard/predictive` | JWT (no ciudadano) | Métricas predictivas (datos de ejemplo) |
| POST | `/api/v1/predict/severity` | No | Predicción de severidad + insight gerencial |

### Filtros del dashboard (`DashboardFilters`)

`ciudad`, `anio_inicio`, `anio_fin`, `mes`, `dia_semana`, `gravedad`,
`clase_accidente`, `barrio_localidad`, `hora_inicio`, `hora_fin`.

## 6. Modelo de datos

### Colección `siniestros`

Campos usados: `ciudad`, `gravedad`, `clase_accidente`, `barrio_localidad`,
`anio` (con valores inválidos), `fecha_hora`, `mes`, `dia_semana`, `hora`.

### Colección `usuarios`

`username`, `email`, `hashed_password` (bcrypt), `rol`, `disabled`.

## 7. Machine Learning

- Script: `backend/app/ml/train_model.py` (`python -m app.ml.train_model` desde `backend`).
- Clasificación binaria: `0` = SOLO DAÑOS, `1` = CON HERIDOS / CON MUERTOS.
- Muestra aleatoria de 50.000 registros (`$sample`), split 80/20 estratificado.
- Limpieza: excluye `GRAVEDAD = OTRO`, años fuera de 2000–2030, ciudades con una
  sola clase y segmentos (ciudad, año) casi puros (>= 97 % de una clase).
- Se entrenan dos variantes (con/sin año) y se guarda la definida por `USAR_ANIO`
  (actualmente `False`).
- Variables finales del modelo guardado: `CLASE_ENC`, `CIUDAD_ENC`.
- Artefactos: `severity_model.pkl`, `le_clase.pkl`, `le_ciudad.pkl`.

## 8. Cómo ejecutar

### Backend

```powershell
cd backend
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Requiere MongoDB en `mongodb://localhost:27017/` (configurable con `MONGO_URI`).

Crear usuarios de prueba:

```powershell
curl -X POST http://127.0.0.1:8000/api/v1/auth/setup-inicial
```

### Frontend

```powershell
cd frontend
npm install
npm run dev
```

### Entrenar el modelo

```powershell
cd backend
python -m app.ml.train_model
```

## 9. Usuarios de prueba

| Usuario | Contraseña | Rol |
|---|---|---|
| admin | admin123 | admin |
| analista | analista123 | analista |
| ciudadano | ciudadano123 | ciudadano |

## 10. Decisiones y notas

- Los datos históricos tienen problemas de registro: `anio` inválido (0, 20140…),
  `GRAVEDAD = OTRO`, y cambios de criterio por ciudad/año. El script de entrenamiento
  documenta y filtra cada caso.
- `class_weight="balanced"` empeora el recall de casos graves (la clase minoritaria
  es "solo daños"), por eso queda en `None`.
- El frontend usa `react-grid-layout/legacy` para el dashboard redimensionable.
- El widget predictivo (`PredictorWidget`) consulta `/api/v1/predict/severity`.

## 11. Riesgos y pendientes

- `SECRET_KEY` y credenciales de MongoDB están hardcodeadas por defecto; mover a `.env`.
- CORS abierto a `*`; restringir en producción.
- `/auth/setup-inicial` está expuesto sin protección; deshabilitar en producción.
- `/dashboard/predictive` retorna valores fijos, no calculados sobre los datos.
- No existen pruebas automatizadas ni lint de backend.
- `frontend/eslint.config.js` disponible (`npm run lint`).

## 12. Bitácora

| Fecha | Cambio |
|---|---|
| 2026-10-19 | Creación de esta memoria con el estado inicial del proyecto. |
| 2026-10-19 | Creación de `ASESORIA_PF.md` con las respuestas para la asesoría del PF. |

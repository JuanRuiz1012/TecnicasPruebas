from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from app.models.filter_model import DashboardFilters
from app.services.dashboard_service import DashboardService
from app.services.ml_service import MLService
from app.core.security import SECRET_KEY, ALGORITHM

router = APIRouter(prefix="/api/v1/dashboard", tags=["Dashboard BI"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/token")

dashboard_service = DashboardService()
ml_service = MLService()

def get_current_user(token: str = Depends(oauth2_scheme)):
    """Valida el token en cada petición."""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        rol: str = payload.get("rol")
        if username is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token inválido")
        return {"username": username, "rol": rol}
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="No se pudo validar las credenciales")

@router.post("/descriptive")
def obtener_analisis_descriptivo(filters: DashboardFilters, current_user: dict = Depends(get_current_user)):
    """Requiere login. Devuelve las 10 métricas y 5 gráficas."""
    return dashboard_service.get_descriptive_analytics(filters)

@router.post("/predictive")
def obtener_analisis_predictivo(filters: DashboardFilters, current_user: dict = Depends(get_current_user)):
    """Requiere login. Accesible idealmente solo para analistas y admins."""
    if current_user["rol"] == "ciudadano":
         raise HTTPException(status_code=403, detail="No tienes permisos para ver predicciones")
    return ml_service.get_predictive_analytics(filters)
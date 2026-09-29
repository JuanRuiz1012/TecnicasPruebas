from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from app.services.auth_service import AuthService
from app.core.security import get_password_hash
from app.repositories.user_repository import UserRepository
from app.models.user_model import RolUsuario

router = APIRouter(prefix="/api/v1/auth", tags=["Autenticación"])
auth_service = AuthService()
user_repo = UserRepository()

@router.post("/token")
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    return auth_service.login_for_access_token(form_data)

@router.post("/setup-inicial")
def crear_usuarios_prueba():
    """Endpoint temporal para crear los 3 usuarios base requeridos (Requerimiento 9)."""
    usuarios = [
        # Agregamos .value para que MongoDB guarde el texto "admin", "analista", etc.
        {"username": "admin", "email": "admin@test.com", "rol": RolUsuario.ADMINISTRADOR.value, "hashed_password": get_password_hash("admin123")},
        {"username": "analista", "email": "analista@test.com", "rol": RolUsuario.ANALISTA.value, "hashed_password": get_password_hash("analista123")},
        {"username": "ciudadano", "email": "ciudadano@test.com", "rol": RolUsuario.CIUDADANO.value, "hashed_password": get_password_hash("ciudadano123")}
    ]
    for u in usuarios:
        user_repo.create_user(u)
    return {"mensaje": "Usuarios de prueba creados exitosamente"}
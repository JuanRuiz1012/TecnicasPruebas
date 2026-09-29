from pydantic import BaseModel, EmailStr
from typing import Optional
from enum import Enum

# Requerimiento 9: 3 Tipos de Usuarios
class RolUsuario(str, Enum):
    ADMINISTRADOR = "admin"       # Acceso total 
    ANALISTA = "analista"         # Acceso al dashboard descriptivo y predictivo
    CIUDADANO = "ciudadano"       # Acceso solo al dashboard 

class UserInDB(BaseModel):
    username: str
    email: EmailStr
    hashed_password: str
    rol: RolUsuario
    disabled: Optional[bool] = False

class UserLogin(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    rol: str
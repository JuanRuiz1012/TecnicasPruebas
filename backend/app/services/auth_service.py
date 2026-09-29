from app.repositories.user_repository import UserRepository
from app.core.security import verify_password, create_access_token
from fastapi import HTTPException, status

class AuthService:
    def __init__(self):
        self.user_repo = UserRepository()

    def authenticate_user(self, username: str, password: str):
        user_in_db = self.user_repo.get_user_by_username(username)
        if not user_in_db:
            return False
        if not verify_password(password, user_in_db["hashed_password"]):
            return False
        return user_in_db

    def login_for_access_token(self, form_data):
        user = self.authenticate_user(form_data.username, form_data.password)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Usuario o contraseña incorrectos",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        access_token = create_access_token(data={"sub": user["username"], "rol": user["rol"]})
        
        return {
            "access_token": access_token, 
            "token_type": "bearer",
            "rol": user["rol"]
        }
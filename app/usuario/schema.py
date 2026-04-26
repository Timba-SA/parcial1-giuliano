from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional, List

class UsuarioCreate(BaseModel):
    nombre: str
    apellido: str
    email: EmailStr
    celular: Optional[str] = None
    password: str
    
    @field_validator('password', mode='before')
    @classmethod
    def validate_password(cls, v: str) -> str:
        # Truncar a 72 bytes (límite de bcrypt) - convierte a bytes primero para contar bytes reales, no caracteres
        password_bytes = v.encode('utf-8')
        if len(password_bytes) > 72:
            # Truncar y convertir de vuelta a string
            return password_bytes[:72].decode('utf-8', errors='ignore')
        return v

class UsuarioUpdate(BaseModel):
    nombre: Optional[str] = None
    apellido: Optional[str] = None
    celular: Optional[str] = None
    is_active: Optional[bool] = None

class UsuarioOut(BaseModel):
    id: int
    nombre: str
    apellido: str
    email: EmailStr
    celular: Optional[str] = None
    is_active: bool

class Token(BaseModel):
    access_token: str
    token_type: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

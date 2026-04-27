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
        password_bytes = v.encode('utf-8')
        if len(password_bytes) > 72:
            return password_bytes[:72].decode('utf-8', errors='ignore')
        return v


class UsuarioUpdate(BaseModel):
    nombre: Optional[str] = None
    apellido: Optional[str] = None
    celular: Optional[str] = None
    is_active: Optional[bool] = None


class RolOut(BaseModel):
    codigo: str
    descripcion: Optional[str] = None

    model_config = {"from_attributes": True}


class UsuarioOut(BaseModel):
    id: int
    nombre: str
    apellido: str
    email: EmailStr
    celular: Optional[str] = None
    is_active: bool
    roles: List[RolOut] = []

    model_config = {"from_attributes": True}


class UsuarioRolAsign(BaseModel):
    rol_codigo: str


class Token(BaseModel):
    access_token: str
    token_type: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str

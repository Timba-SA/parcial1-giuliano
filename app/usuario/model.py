from sqlmodel import SQLModel, Field, Relationship
from typing import List, Optional
from datetime import datetime
from app.rol.model import Rol

class UsuarioRol(SQLModel, table=True):
    usuario_id: int = Field(foreign_key="usuario.id", primary_key=True)
    rol_codigo: str = Field(foreign_key="rol.codigo", primary_key=True)
    asignado_por_id: Optional[int] = Field(default=None, foreign_key="usuario.id")
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Usuario(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    nombre: str = Field(max_length=80)
    apellido: str = Field(max_length=80)
    email: str = Field(max_length=254, unique=True, index=True)
    celular: Optional[str] = Field(default=None, max_length=20)
    password_hash: str = Field(max_length=128)
    is_active: bool = Field(default=True)
    
    # Relaciones
    roles: List["Rol"] = Relationship(link_model=UsuarioRol, sa_relationship_kwargs={"primaryjoin": "Usuario.id==UsuarioRol.usuario_id"})
    direcciones: List["DireccionEntrega"] = Relationship(back_populates="usuario")

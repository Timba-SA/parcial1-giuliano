from sqlmodel import SQLModel, Field, Relationship
from typing import Optional
from app.usuario.model import Usuario

class DireccionEntrega(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    usuario_id: int = Field(foreign_key="usuario.id")
    etiqueta: Optional[str] = Field(default=None, max_length=80)
    linea1: str
    linea2: Optional[str] = None
    ciudad: str = Field(max_length=100)
    es_principal: bool = Field(default=False)

    usuario: "Usuario" = Relationship(back_populates="direcciones")

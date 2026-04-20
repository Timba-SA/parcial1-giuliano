from sqlmodel import SQLModel, Field
from typing import Optional

class Rol(SQLModel, table=True):
    codigo: str = Field(primary_key=True, max_length=20)
    descripcion: Optional[str] = None

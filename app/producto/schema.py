from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

# ==========================
# Schemas para Ingrediente
# ==========================
class IngredienteBase(BaseModel):
    nombre: str = Field(..., max_length=100)
    descripcion: Optional[str] = None
    stock: int = Field(default=0, ge=0)
    unidad_medida: str = Field(default="g")

class IngredienteCreate(IngredienteBase):
    pass

class IngredienteUpdate(BaseModel):
    nombre: Optional[str] = Field(None, max_length=100)
    descripcion: Optional[str] = None
    stock: Optional[int] = Field(None, ge=0)
    unidad_medida: Optional[str] = None

class IngredienteOut(IngredienteBase):
    id: int

    class Config:
        from_attributes = True


# ==========================
# Schemas para Producto
# ==========================
class ProductoBase(BaseModel):
    nombre: str = Field(..., max_length=150)
    descripcion: Optional[str] = None
    precio_base: float = Field(..., ge=0.0)
    tiempo_prep_min: Optional[int] = Field(None, ge=1)
    disponible: bool = Field(default=True)

class ProductoCreate(ProductoBase):
    categoria_ids: List[int] = []
    ingrediente_ids: List[int] = []

class ProductoUpdate(BaseModel):
    nombre: Optional[str] = Field(None, max_length=150)
    descripcion: Optional[str] = None
    precio_base: Optional[float] = Field(None, ge=0.0)
    tiempo_prep_min: Optional[int] = Field(None, ge=1)
    disponible: Optional[bool] = None
    categoria_ids: Optional[List[int]] = None
    ingrediente_ids: Optional[List[int]] = None


class CategoriaRefOut(BaseModel):
    id: int
    nombre: str
    descripcion: Optional[str] = None
    orden_display: int
    activo: bool

    class Config:
        from_attributes = True

class ProductoOut(ProductoBase):
    id: int
    created_at: datetime
    ingredientes: List[IngredienteOut] = []
    categorias: List[CategoriaRefOut] = []

    class Config:
        from_attributes = True


# ==========================
# Schemas para Categoria
# ==========================
class CategoriaBase(BaseModel):
    nombre: str = Field(..., max_length=100)
    descripcion: Optional[str] = None
    orden_display: int = Field(default=0, ge=0)
    parent_id: Optional[int] = None
    activo: bool = Field(default=True)


class CategoriaCreate(CategoriaBase):
    pass


class CategoriaUpdate(BaseModel):
    nombre: Optional[str] = Field(None, max_length=100)
    descripcion: Optional[str] = None
    orden_display: Optional[int] = Field(None, ge=0)
    parent_id: Optional[int] = None
    activo: Optional[bool] = None


class CategoriaOut(CategoriaBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

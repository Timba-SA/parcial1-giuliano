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

class ProductoOut(ProductoBase):
    id: int
    created_at: datetime
    ingredientes: List[IngredienteOut] = []
    # categorias: List[CategoriaOut] = []  # To be added if Categoria schema is available

    class Config:
        from_attributes = True

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
# Schemas para Relaciones Pivot
# ==========================
class ProductoCategoriaCreate(BaseModel):
    categoria_id: int
    es_principal: bool = False

class ProductoIngredienteCreate(BaseModel):
    ingrediente_id: int
    es_removible: bool = True
    es_opcional: bool = False

class ProductoIngredienteDetailOut(IngredienteOut):
    es_removible: bool
    es_opcional: bool

class ProductoCategoriaDetailOut(BaseModel):
    id: int
    nombre: str
    descripcion: Optional[str] = None
    orden_display: int
    activo: bool
    created_at: datetime
    es_principal: bool


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
    categorias: List[ProductoCategoriaCreate] = []
    ingredientes: List[ProductoIngredienteCreate] = []

class ProductoUpdate(BaseModel):
    nombre: Optional[str] = Field(None, max_length=150)
    descripcion: Optional[str] = None
    precio_base: Optional[float] = Field(None, ge=0.0)
    tiempo_prep_min: Optional[int] = Field(None, ge=1)
    disponible: Optional[bool] = None
    categorias: Optional[List[ProductoCategoriaCreate]] = None
    ingredientes: Optional[List[ProductoIngredienteCreate]] = None


class ProductoOut(ProductoBase):
    id: int
    created_at: datetime
    ingredientes: List[ProductoIngredienteDetailOut] = []
    categorias: List[ProductoCategoriaDetailOut] = []

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

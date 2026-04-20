# Implementación de Código: Track 2 - Catálogo

Este track se encarga de las categorías (estructura de árbol) y los ingredientes. Vas a trabajar en `app/categoria/` y `app/ingrediente/`.

## 1. Base de Datos (Modelos SQLModel)

En `app/categoria/model.py`:
```python
from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List
from datetime import datetime

class Categoria(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    nombre: str = Field(max_length=100, unique=True, index=True)
    descripcion: Optional[str] = None
    orden_display: int = Field(default=0)
    parent_id: Optional[int] = Field(default=None, foreign_key="categoria.id")
    
    # Audit
    created_at: datetime = Field(default_factory=datetime.utcnow)

    # Relación Recursiva Padre/Hija
    subcategorias: List["Categoria"] = Relationship(back_populates="parent")
    parent: Optional["Categoria"] = Relationship(back_populates="subcategorias")
    
    # Productos
    productos: List["Producto"] = Relationship(
        back_populates="categorias",
        link_model="ProductoCategoria"
    )
```

En `app/ingrediente/model.py`:
```python
from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List

class Ingrediente(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    nombre: str = Field(max_length=100, unique=True, index=True)
    es_alergeno: bool = Field(default=False)

    # Relación N:M a Producto a traves de ProductoIngrediente
    productos: List["Producto"] = Relationship(
        back_populates="ingredientes",
        link_model="ProductoIngrediente"
    )
```

## 2. API (Schemas y Routers)

Ejemplo en `app/categoria/schema.py`:
```python
from pydantic import BaseModel, constr
from typing import Optional

class CategoriaCreate(BaseModel):
    nombre: str = Field(..., max_length=100)
    descripcion: Optional[str] = None
    orden_display: Optional[int] = 0
    parent_id: Optional[int] = None

class CategoriaOut(CategoriaCreate):
    id: int
```

En `app/categoria/router.py`:
```python
from fastapi import APIRouter, Query, Path
from typing import Annotated
from .schema import CategoriaCreate, CategoriaOut

router = APIRouter(prefix="/categorias", tags=["Categorías"])

@router.get("/", response_model=list[CategoriaOut])
def get_categorias(limit: Annotated[int, Query(ge=1, le=100)] = 20):
    # Lógica con Query de SQLModel
    pass

@router.post("/", response_model=CategoriaOut, status_code=201)
def create_categoria(cat_in: CategoriaCreate):
    pass
```

## 3. Frontend (React + TanStack Query)

En `hooks/useCategorias.ts` para obtener y crear:
```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

interface Categoria {
  id: number;
  nombre: string;
  orden_display: number;
}

export const useCategorias = () => {
  return useQuery({
    queryKey: ['categorias'],
    queryFn: async () => {
      const { data } = await axios.get<Categoria[]>('http://localhost:8000/categorias/');
      return data;
    }
  });
};

export const useCrearCategoria = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (nuevaCat: Partial<Categoria>) => {
      await axios.post('http://localhost:8000/categorias/', nuevaCat);
    },
    onSuccess: () => {
      // Invalida la cache para que la tabla se refresque automaticamente
      queryClient.invalidateQueries({ queryKey: ['categorias'] });
    }
  });
};
```
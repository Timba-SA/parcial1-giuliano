# Implementación de Código: Track 3 - Productos y Relaciones

Este track es central porque conecta Productos con Categorías e Ingredientes a través de tablas intermedias (Pivot). Trabajaras en `app/producto/`.

## 1. Base de Datos (Modelos SQLModel)

En `app/producto/model.py`:
```python
from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List
from datetime import datetime

# Tablas Pivot (N:M)
class ProductoCategoria(SQLModel, table=True):
    producto_id: int = Field(foreign_key="producto.id", primary_key=True)
    categoria_id: int = Field(foreign_key="categoria.id", primary_key=True)
    es_principal: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)

class ProductoIngrediente(SQLModel, table=True):
    producto_id: int = Field(foreign_key="producto.id", primary_key=True)
    ingrediente_id: int = Field(foreign_key="ingrediente.id", primary_key=True)
    es_removible: bool = Field(default=True)
    es_opcional: bool = Field(default=False)

# Tabla Principal
class Producto(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    nombre: str = Field(max_length=150)
    descripcion: Optional[str] = None
    precio_base: float = Field(default=0.0)
    tiempo_prep_min: Optional[int] = None
    disponible: bool = Field(default=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Relaciones N:M declaradas usando link_model
    categorias: List["Categoria"] = Relationship(
        back_populates="productos",
        link_model=ProductoCategoria
    )
    ingredientes: List["Ingrediente"] = Relationship(
        back_populates="productos",
        link_model=ProductoIngrediente
    )
```

## 2. API (Schemas y Routers)

Ejemplo en `app/producto/schema.py`:
```python
from pydantic import BaseModel, Field
from typing import List, Optional

class ProductoCreate(BaseModel):
    nombre: str = Field(..., max_length=150)
    descripcion: Optional[str] = None
    precio_base: float = Field(..., ge=0.0)
    tiempo_prep_min: Optional[int] = Field(None, ge=1)
    categoria_ids: List[int] = [] # Para vincular categorías al crear

class ProductoOut(ProductoCreate):
    id: int
    disponible: bool
```

En `app/producto/router.py`:
```python
from fastapi import APIRouter, Depends, Query, Path
from typing import Annotated
from .schema import ProductoCreate, ProductoOut

router = APIRouter(prefix="/productos", tags=["Productos"])

@router.get("/", response_model=list[ProductoOut])
def get_productos(
    skip: int = 0,
    limit: Annotated[int, Query(le=100)] = 50,
    disponible: Optional[bool] = None
):
    # Logica con querys dinámicas
    pass
```

## 3. Frontend (React + TanStack Query)

Vas a crear un listado de Productos y un Modal de creación que permita seleccionar Categorías y precios.

Hook de Listado `hooks/useProductos.ts`:
```typescript
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface Producto {
  id: number;
  nombre: string;
  precio_base: number;
  disponible: boolean;
}

export const useProductos = (disponible?: boolean) => {
  return useQuery({
    queryKey: ['productos', disponible],
    queryFn: async () => {
      const url = disponible !== undefined 
          ? `http://localhost:8000/productos/?disponible=${disponible}` 
          : 'http://localhost:8000/productos/';
      const { data } = await axios.get<Producto[]>(url);
      return data;
    }
  });
};
```

Uso en tu página `ProductosPage.tsx`:
```tsx
import { useProductos } from '../hooks/useProductos';
import { Link } from 'react-router-dom';

export default function ProductosPage() {
  const { data: productos, isLoading } = useProductos();

  if (isLoading) return <div>Cargando menú...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
      {productos?.map(prod => (
        <div key={prod.id} className="bg-white rounded-xl shadow-lg p-5">
          <h2 className="text-lg font-bold">{prod.nombre}</h2>
          <p className="text-green-600 font-semibold">${prod.precio_base}</p>
          <Link to={`/productos/${prod.id}`} className="text-blue-500 hover:underline">
            Ver detalle
          </Link>
        </div>
      ))}
    </div>
  );
}
```
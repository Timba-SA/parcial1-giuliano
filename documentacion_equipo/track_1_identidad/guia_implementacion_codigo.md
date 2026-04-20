# Implementación de Código: Track 1 - Identidad y Accesos

Este track se encarga de todo el manejo de usuarios, roles y direcciones de entrega. Según la arquitectura, vas a trabajar en las carpetas `app/usuario/`, `app/rol/` y `app/direccion/`.

## 1. Base de Datos (Modelos SQLModel)

En `app/usuario/model.py` (dentro del contenedor Docker o localmente):
```python
from sqlmodel import SQLModel, Field, Relationship
from typing import List, Optional
from datetime import datetime

# Tabla Intermedia
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
    password_hash: str = Field(max_length=60)
    
    # Relaciones
    roles: List["Rol"] = Relationship(link_model=UsuarioRol)
    direcciones: List["DireccionEntrega"] = Relationship(back_populates="usuario")

class Rol(SQLModel, table=True):
    codigo: str = Field(primary_key=True, max_length=20)
    descripcion: Optional[str] = None
```

En `app/direccion/model.py`:
```python
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

    usuario: Usuario = Relationship(back_populates="direcciones")
```

## 2. API (Schemas y Routers)

Ejemplo en `app/usuario/schema.py`:
```python
from pydantic import BaseModel, EmailStr
from typing import Optional

class UsuarioCreate(BaseModel):
    nombre: str
    apellido: str
    email: EmailStr
    celular: Optional[str] = None
    password: str

class UsuarioOut(BaseModel):
    id: int
    nombre: str
    apellido: str
    email: EmailStr
```

En `app/usuario/router.py`:
```python
from fastapi import APIRouter, Depends, HTTPException, Query, Path
from typing import Annotated
from .schema import UsuarioCreate, UsuarioOut
from .service import crear_usuario

router = APIRouter(prefix="/usuarios", tags=["Usuarios"])

@router.post("/", response_model=UsuarioOut, status_code=201)
def create_usuario(user_in: UsuarioCreate):
    # Llama al servicio (service.py) para hashear password y guardar
    return crear_usuario(user_in)

@router.get("/{id}", response_model=UsuarioOut)
def get_usuario(id: Annotated[int, Path(title="ID del usuario")]):
    # Logica de busqueda
    pass
```

## 3. Frontend (React + TanStack Query)

Debes crear un componente de listado y un formulario. 

Hook para obtener usuarios `hooks/useUsuarios.ts`:
```typescript
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
}

export const useUsuarios = () => {
  return useQuery({
    queryKey: ['usuarios'],
    queryFn: async () => {
      const { data } = await axios.get<Usuario[]>('http://localhost:8000/usuarios/');
      return data;
    }
  });
};
```

Componente Principal `UsuariosPage.tsx`:
```tsx
import { useUsuarios } from '../hooks/useUsuarios';

export default function UsuariosPage() {
  const { data, isLoading, isError } = useUsuarios();

  if (isLoading) return <div>Cargando usuarios...</div>;
  if (isError) return <div>Error al cargar.</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Gestión de Usuarios</h1>
      <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
        {/* Aquí va el map de data y la estructura de la tabla con Tailwind */}
      </table>
    </div>
  );
}
```
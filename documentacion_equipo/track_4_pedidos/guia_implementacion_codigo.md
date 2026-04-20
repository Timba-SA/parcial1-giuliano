# Implementación de Código: Track 4 - Pedidos y Trazabilidad

Este track es crítico. Se encarga del flujo de pedidos y sus estados. Trabajaras en `app/pedido/` y `app/estado_pedido/`.

## 1. Base de Datos (Modelos SQLModel)

En `app/pedido/model.py`:
```python
from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List
from datetime import datetime
from pydantic import condecimal

class EstadoPedido(SQLModel, table=True):
    codigo: str = Field(primary_key=True, max_length=20)
    descripcion: str = Field(max_length=80)
    orden: int
    es_terminal: bool

class FormaPago(SQLModel, table=True):
    codigo: str = Field(primary_key=True, max_length=30)
    descripcion: str = Field(max_length=80)
    activo: bool = True

class Pedido(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    usuario_id: int = Field(foreign_key="usuario.id")
    direccion_id: Optional[int] = Field(default=None, foreign_key="direccion_entrega.id")
    estado_codigo: str = Field(foreign_key="estado_pedido.codigo")
    forma_pago_codigo: str = Field(foreign_key="forma_pago.codigo")
    
    # Snapshots monetarios usando Decimal
    subtotal: float = Field(default=0.0)
    descuento: float = Field(default=0.0)
    costo_envio: float = Field(default=0.0)
    total: float = Field(default=0.0)
    notas: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    # Relaciones 1:N a DetallePedido y Trazabilidad
    detalles: List["DetallePedido"] = Relationship(back_populates="pedido")
    historial: List["HistorialEstadoPedido"] = Relationship(back_populates="pedido")

class DetallePedido(SQLModel, table=True):
    pedido_id: int = Field(foreign_key="pedido.id", primary_key=True)
    producto_id: int = Field(foreign_key="producto.id", primary_key=True)
    cantidad: int = Field(ge=1)
    
    # Snapshot
    nombre_producto_snap: str = Field(max_length=150)
    precio_unitario_snap: float = Field(ge=0.0)
    subtotal_snap: float
    created_at: datetime = Field(default_factory=datetime.utcnow)

class HistorialEstadoPedido(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    pedido_id: int = Field(foreign_key="pedido.id")
    estado_desde: Optional[str] = Field(default=None, foreign_key="estado_pedido.codigo")
    estado_hacia: str = Field(foreign_key="estado_pedido.codigo")
    usuario_id: Optional[int] = Field(default=None, foreign_key="usuario.id")
    motivo: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
```

## 2. API (Schemas y Routers)

Ejemplo en `app/pedido/schema.py`:
```python
from pydantic import BaseModel, Field
from typing import List, Optional

class DetalleCreate(BaseModel):
    producto_id: int
    cantidad: int = Field(..., ge=1)

class PedidoCreate(BaseModel):
    direccion_id: Optional[int] = None
    forma_pago_codigo: str
    detalles: List[DetalleCreate]

class PedidoOut(BaseModel):
    id: int
    total: float
    estado_codigo: str
```

En `app/pedido/router.py`:
```python
from fastapi import APIRouter, HTTPException, Path, Query
from typing import Annotated
from .schema import PedidoCreate, PedidoOut
from .service import process_checkout, move_state

router = APIRouter(prefix="/pedidos", tags=["Pedidos"])

@router.post("/", response_model=PedidoOut, status_code=201)
def checkout(order_in: PedidoCreate):
    # Logica de validacion y creación
    pass

@router.patch("/{id}/estado")
def cambiar_estado(
    id: Annotated[int, Path(title="ID del Pedido")], 
    nuevo_estado: Annotated[str, Query(max_length=20)]
):
    # Logica para validar terminalidad e insertar en historial
    pass
```

## 3. Frontend (React + TanStack Query)

En `hooks/usePedidos.ts`:
```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

interface CheckoutPayload {
  forma_pago_codigo: string;
  direccion_id?: number;
  detalles: Array<{ producto_id: number; cantidad: number }>;
}

export const useCheckout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CheckoutPayload) => {
      const { data } = await axios.post('http://localhost:8000/pedidos/', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pedidos_usuario'] });
    }
  });
};
```
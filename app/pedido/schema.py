from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime


class DetalleCreate(BaseModel):
    producto_id: int
    cantidad: int = Field(..., ge=1)


class PedidoCreate(BaseModel):
    direccion_id: Optional[int] = None
    forma_pago_codigo: str
    detalles: List[DetalleCreate]


class DetalleOut(BaseModel):
    producto_id: int
    cantidad: int
    nombre_producto_snap: str
    precio_unitario_snap: float
    subtotal_snap: float


class PedidoOut(BaseModel):
    id: int
    subtotal: float
    descuento: float
    costo_envio: float
    total: float
    estado_codigo: str
    detalles: List[DetalleOut] = []
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

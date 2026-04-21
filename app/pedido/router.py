from fastapi import APIRouter, HTTPException, Depends, Path, Query, status
from typing import List, Optional
from app.pedido.schema import PedidoCreate, PedidoOut, DetalleOut
from app.pedido.service import process_checkout, move_state
from app.core.database import get_session
from app.core.security_extra import get_current_user_optional
from sqlmodel import Session, select
from app.pedido.model import Pedido, DetallePedido

router = APIRouter(prefix="/pedidos", tags=["Pedidos"])


@router.post("/", response_model=PedidoOut, status_code=status.HTTP_201_CREATED)
def checkout(order_in: PedidoCreate, session: Session = Depends(get_session), current_user=Depends(get_current_user_optional)):
    try:
        user_id = None
        if current_user:
            user_id = getattr(current_user, 'id', None)
        pedido = process_checkout(order_in, session, usuario_id=user_id)
        # Construir detalles para la respuesta
        detalles = []
        try:
            detalles_rows = session.exec(select(DetallePedido).where(DetallePedido.pedido_id == pedido.id)).all()
            for d in detalles_rows:
                detalles.append(DetalleOut(
                    producto_id=d.producto_id,
                    cantidad=d.cantidad,
                    nombre_producto_snap=d.nombre_producto_snap,
                    precio_unitario_snap=d.precio_unitario_snap,
                    subtotal_snap=d.subtotal_snap,
                ))
        except Exception:
            detalles = []

        return PedidoOut(
            id=pedido.id,
            subtotal=pedido.subtotal,
            descuento=pedido.descuento,
            costo_envio=pedido.costo_envio,
            total=pedido.total,
            estado_codigo=pedido.estado_codigo,
            detalles=detalles,
            created_at=pedido.created_at,
            updated_at=pedido.updated_at,
        )
    except Exception as e:
        # Errores de validación en service lanzan ValueError -> 400
        if isinstance(e, ValueError):
            raise HTTPException(status_code=400, detail=str(e))
        raise HTTPException(status_code=500, detail="Error interno")


@router.get("/", response_model=List[PedidoOut])
def list_pedidos(
    user_id: Optional[int] = Query(None),
    estado: Optional[str] = Query(None),
    limit: int = Query(100, ge=1),
    offset: int = Query(0, ge=0),
    session: Session = Depends(get_session),
    current_user=Depends(get_current_user_optional),
):
    q = select(Pedido)
    # Si no se pasa user_id y hay un usuario autenticado, filtrar por su id
    if user_id is None and current_user is not None:
        user_id = getattr(current_user, 'id', None)
    if user_id is not None:
        q = q.where(Pedido.usuario_id == user_id)
    if estado is not None:
        q = q.where(Pedido.estado_codigo == estado)
    # Aplicar paginación
    q = q.offset(offset).limit(limit)
    pedidos = session.exec(q).all()
    # Para listado devolvemos la info resumida (detalles vacíos)
    return [PedidoOut(
        id=p.id,
        subtotal=p.subtotal,
        descuento=p.descuento,
        costo_envio=p.costo_envio,
        total=p.total,
        estado_codigo=p.estado_codigo,
        detalles=[],
        created_at=p.created_at,
        updated_at=p.updated_at,
    ) for p in pedidos]


@router.get("/{id}", response_model=PedidoOut)
def get_pedido(id: int = Path(...), session: Session = Depends(get_session)):
    pedido = session.get(Pedido, id)
    if not pedido:
        raise HTTPException(status_code=404, detail="Pedido no encontrado")
    detalles = []
    try:
        detalles_rows = session.exec(select(DetallePedido).where(DetallePedido.pedido_id == pedido.id)).all()
        for d in detalles_rows:
            detalles.append(DetalleOut(
                producto_id=d.producto_id,
                cantidad=d.cantidad,
                nombre_producto_snap=d.nombre_producto_snap,
                precio_unitario_snap=d.precio_unitario_snap,
                subtotal_snap=d.subtotal_snap,
            ))
    except Exception:
        detalles = []
    return PedidoOut(
        id=pedido.id,
        subtotal=pedido.subtotal,
        descuento=pedido.descuento,
        costo_envio=pedido.costo_envio,
        total=pedido.total,
        estado_codigo=pedido.estado_codigo,
        detalles=detalles,
        created_at=pedido.created_at,
        updated_at=pedido.updated_at,
    )


@router.patch("/{id}/estado")
def cambiar_estado(id: int = Path(...), nuevo_estado: str = Query(..., max_length=20), usuario_id: Optional[int] = Query(None), session: Session = Depends(get_session), current_user=Depends(get_current_user_optional)):
    try:
        if current_user and usuario_id is None:
            usuario_id = getattr(current_user, 'id', None)
        pedido = move_state(id, nuevo_estado, session, usuario_id)
        # Devolver estado actualizado (con detalles resumidos)
        return PedidoOut(
            id=pedido.id,
            subtotal=pedido.subtotal,
            descuento=pedido.descuento,
            costo_envio=pedido.costo_envio,
            total=pedido.total,
            estado_codigo=pedido.estado_codigo,
            detalles=[],
            created_at=pedido.created_at,
            updated_at=pedido.updated_at,
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/{id}")
def cancelar_pedido(id: int = Path(...), session: Session = Depends(get_session)):
    try:
        pedido = move_state(id, "cancelled", session)
        return PedidoOut(
            id=pedido.id,
            subtotal=pedido.subtotal,
            descuento=pedido.descuento,
            costo_envio=pedido.costo_envio,
            total=pedido.total,
            estado_codigo=pedido.estado_codigo,
            detalles=[],
            created_at=pedido.created_at,
            updated_at=pedido.updated_at,
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

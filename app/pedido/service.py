from typing import Optional
import logging
from sqlmodel import Session, select
from app.pedido.model import Pedido, DetallePedido, HistorialEstadoPedido, EstadoPedido
from app.producto.model import Producto

logger = logging.getLogger(__name__)


def process_checkout(order_in, session: Session, usuario_id: Optional[int] = None) -> Pedido:
    """
    Crea un pedido y sus detalles de forma transaccional.
    Toma snapshot del producto al momento del pedido.
    """
    pedido = Pedido(
        usuario_id=usuario_id,          # puede ser None — FK nullable
        direccion_id=order_in.direccion_id,
        estado_codigo="pending",
        forma_pago_codigo=order_in.forma_pago_codigo,
        subtotal=0.0,
        descuento=0.0,
        costo_envio=0.0,
        total=0.0,
    )

    session.add(pedido)
    session.flush()  # obtener pedido.id sin cerrar la transacción

    total = 0.0
    for d in order_in.detalles:
        producto = session.exec(
            select(Producto).where(Producto.id == d.producto_id)
        ).one_or_none()

        if not producto:
            raise ValueError(f"Producto con id {d.producto_id} no existe")
        if not producto.disponible:
            raise ValueError(f"El producto '{producto.nombre}' no está disponible")

        precio = float(producto.precio_base)
        subtotal_snap = precio * d.cantidad
        total += subtotal_snap

        detalle = DetallePedido(
            pedido_id=pedido.id,
            producto_id=d.producto_id,
            cantidad=d.cantidad,
            nombre_producto_snap=str(producto.nombre),
            precio_unitario_snap=precio,
            subtotal_snap=subtotal_snap,
        )
        session.add(detalle)

    pedido.subtotal = total
    pedido.total = total
    session.add(pedido)

    historial = HistorialEstadoPedido(
        pedido_id=pedido.id,
        estado_desde=None,
        estado_hacia="pending",
        usuario_id=usuario_id,
        motivo=None,
    )
    session.add(historial)

    session.commit()
    session.refresh(pedido)
    return pedido


def move_state(pedido_id: int, nuevo_estado: str, session: Session, usuario_id: Optional[int] = None):
    """Mueve el estado del pedido validando que exista y no sea terminal."""
    pedido = session.get(Pedido, pedido_id)
    if not pedido:
        raise ValueError("Pedido no encontrado")

    estado = session.get(EstadoPedido, nuevo_estado)
    if not estado:
        raise ValueError("Estado destino inválido")

    estado_actual = session.get(EstadoPedido, pedido.estado_codigo)
    if estado_actual and getattr(estado_actual, "es_terminal", False):
        raise ValueError("No se puede cambiar estado desde un estado terminal")

    antiguo = pedido.estado_codigo
    pedido.estado_codigo = nuevo_estado
    session.add(pedido)

    historial = HistorialEstadoPedido(
        pedido_id=pedido.id,
        estado_desde=antiguo,
        estado_hacia=nuevo_estado,
        usuario_id=usuario_id,
    )
    session.add(historial)

    session.commit()
    session.refresh(pedido)
    return pedido

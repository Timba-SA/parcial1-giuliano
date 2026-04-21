from typing import Optional
import logging
from sqlmodel import Session, select
from app.pedido.model import Pedido, DetallePedido, HistorialEstadoPedido, EstadoPedido
from app.producto.model import Producto
from app.core.database import engine

logger = logging.getLogger(__name__)


def process_checkout(order_in: "PedidoCreate", session: Session, usuario_id: Optional[int] = None) -> Pedido:
    """
    Crea un pedido y sus detalles de forma transaccional.
    Toma snapshot de producto si existe, si no usa valores por defecto.
    """
    from app.pedido.schema import PedidoCreate

    assert isinstance(session, Session)

    pedido = Pedido(
        usuario_id=usuario_id or 0,
        direccion_id=order_in.direccion_id,
        estado_codigo="pending",
        forma_pago_codigo=order_in.forma_pago_codigo,
        subtotal=0.0,
        descuento=0.0,
        costo_envio=0.0,
        total=0.0,
    )

    with session.begin():
        session.add(pedido)
        session.flush()  # para obtener pedido.id

        total = 0.0
        any_missing_stock_field = False
        for d in order_in.detalles:
            # Intentar obtener producto
            producto = None
            try:
                producto = session.exec(select(Producto).where(Producto.id == d.producto_id)).one_or_none()
            except Exception:
                producto = None

            if producto:
                nombre = getattr(producto, "nombre", "desconocido")
                precio = getattr(producto, "precio_base", 0.0)
                # B2 policy: if product has 'stock' attribute validate quantity <= stock but DO NOT decrement here
                if hasattr(producto, "stock"):
                    stock_val = getattr(producto, "stock")
                    try:
                        if d.cantidad > stock_val:
                            raise ValueError(f"Stock insuficiente para producto {producto.id}")
                    except TypeError:
                        # stock not an int/float: treat as missing
                        any_missing_stock_field = True
                        logger.warning(f"Producto {producto.id} tiene stock no numérico; se ignora para esta iteración")
                else:
                    any_missing_stock_field = True
                    logger.warning(f"Producto {d.producto_id} no tiene atributo 'stock' - dependencia Track 3")
            else:
                nombre = "desconocido"
                precio = 0.0
                any_missing_stock_field = True
                logger.warning(f"Producto {d.producto_id} no encontrado al crear pedido")

            subtotal_snap = precio * d.cantidad
            total += subtotal_snap

            detalle = DetallePedido(
                pedido_id=pedido.id,
                producto_id=d.producto_id,
                cantidad=d.cantidad,
                nombre_producto_snap=nombre,
                precio_unitario_snap=precio,
                subtotal_snap=subtotal_snap,
            )
            session.add(detalle)

        pedido.subtotal = total
        pedido.total = total  # por ahora sin descuentos ni costo envio
        session.add(pedido)

        # Crear historial inicial con posible motivo si faltan campos de stock
        motivo = None
        if any_missing_stock_field:
            motivo = "Aviso: algunos productos no tienen campo 'stock' o no fueron encontrados. Dependencia: Track 3."

        historial = HistorialEstadoPedido(
            pedido_id=pedido.id,
            estado_desde=None,
            estado_hacia="pending",
            usuario_id=usuario_id,
            motivo=motivo,
        )
        session.add(historial)

    # refrescar instancia
    session.refresh(pedido)
    # Cargar detalles explícitamente para asegurar que estén disponibles en la respuesta
    try:
        detalles = session.exec(select(DetallePedido).where(DetallePedido.pedido_id == pedido.id)).all()
        pedido.detalles = detalles
    except Exception:
        # no bloquear por errores menores de carga de relación
        logger.debug(f"No se pudieron cargar los detalles del pedido {pedido.id} de forma explícita")

    return pedido


def move_state(pedido_id: int, nuevo_estado: str, session: Session, usuario_id: Optional[int] = None):
    """Mueve el estado del pedido y crea registro en historial.
    Valida existencia de estado y que no sea terminal si se intenta avanzar.
    """
    # Validar existencia de pedido
    pedido = session.get(Pedido, pedido_id)
    if not pedido:
        raise ValueError("Pedido no encontrado")

    # Validar estado destino
    estado = session.get(EstadoPedido, nuevo_estado)
    if not estado:
        raise ValueError("Estado destino inválido")

    # Validar terminalidad del estado actual: no permitir transiciones desde un estado terminal
    estado_actual = session.get(EstadoPedido, pedido.estado_codigo)
    if estado_actual and getattr(estado_actual, "es_terminal", False):
        raise ValueError("No se puede cambiar estado desde un estado terminal")

    with session.begin():
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

    session.refresh(pedido)
    return pedido

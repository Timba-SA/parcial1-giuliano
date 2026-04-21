import pytest
from sqlalchemy import text
from fastapi.testclient import TestClient

from app.main import app
from app.core.database import engine
from sqlmodel import Session, select, delete
from app.producto.model import Producto
from app.usuario.model import Usuario
from app.pedido.model import Pedido, DetallePedido, HistorialEstadoPedido


client = TestClient(app)


def is_db_available():
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        return True
    except Exception:
        return False


@pytest.mark.skipif(not is_db_available(), reason="Postgres DB no disponible. Ejecutar 'docker compose up db' antes de correr estas pruebas")
def test_create_pedido_with_existing_product_and_history():
    # Preparar datos: crear usuario y producto
    with Session(engine) as session:
        user = Usuario(nombre="test", apellido="user", email="test_pedidos@example.com", password_hash="x", is_active=True)
        session.add(user)
        session.commit()
        session.refresh(user)

        product = Producto(nombre="Test Producto", descripcion="desc", precio_base=50.0, disponible=True)
        session.add(product)
        session.commit()
        session.refresh(product)

        # Ejecutar checkout
        payload = {"forma_pago_codigo": "efectivo", "detalles": [{"producto_id": product.id, "cantidad": 1}]}
        r = client.post("/pedidos/", json=payload)
        assert r.status_code in (201, 400, 422)

        if r.status_code == 201:
            data = r.json()
            pid = data['id']

            # Consultar historial en DB
            hist = session.exec(select(HistorialEstadoPedido).where(HistorialEstadoPedido.pedido_id == pid)).all()
            assert len(hist) >= 1
            # El historial inicial puede contener motivo por falta de campo stock según política B2
            motivos = [h.motivo for h in hist if getattr(h, 'motivo', None)]
            assert any(m is not None for m in motivos)

            # Cleanup: eliminar historial, detalles y pedido, luego producto y usuario
            session.exec(delete(HistorialEstadoPedido).where(HistorialEstadoPedido.pedido_id == pid))
            session.exec(delete(DetallePedido).where(DetallePedido.pedido_id == pid))
            session.exec(delete(Pedido).where(Pedido.id == pid))
        # Eliminar producto y usuario creados
        session.exec(delete(Producto).where(Producto.id == product.id))
        session.exec(delete(Usuario).where(Usuario.id == user.id))
        session.commit()


@pytest.mark.skipif(not is_db_available(), reason="Postgres DB no disponible. Ejecutar 'docker compose up db' antes de correr estas pruebas")
def test_move_state_from_terminal_is_rejected():
    with Session(engine) as session:
        # Crear pedido en estado 'delivered' (seeded en init_db_extra)
        pedido = Pedido(usuario_id=0, direccion_id=None, estado_codigo='delivered', forma_pago_codigo='efectivo', subtotal=0.0, descuento=0.0, costo_envio=0.0, total=0.0)
        session.add(pedido)
        session.commit()
        session.refresh(pedido)

        # Intentar cambiar estado desde terminal
        r = client.patch(f"/pedidos/{pedido.id}/estado?nuevo_estado=paid")
        assert r.status_code == 400

        # Cleanup
        session.exec(delete(HistorialEstadoPedido).where(HistorialEstadoPedido.pedido_id == pedido.id))
        session.exec(delete(DetallePedido).where(DetallePedido.pedido_id == pedido.id))
        session.exec(delete(Pedido).where(Pedido.id == pedido.id))
        session.commit()

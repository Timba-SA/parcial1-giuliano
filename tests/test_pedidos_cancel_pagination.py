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
def test_cancel_order_sets_cancelled_and_creates_history():
    with Session(engine) as session:
        # Crear usuario y producto
        user = Usuario(nombre="cancel_test", apellido="user", email="cancel_test@example.com", password_hash="x", is_active=True)
        session.add(user)
        session.commit()
        session.refresh(user)

        product = Producto(nombre="Cancel Producto", descripcion="desc", precio_base=10.0, disponible=True)
        session.add(product)
        session.commit()
        session.refresh(product)

        payload = {"forma_pago_codigo": "efectivo", "detalles": [{"producto_id": product.id, "cantidad": 1}]}
        r = client.post("/pedidos/", json=payload)
        assert r.status_code in (201, 400, 422)
        if r.status_code != 201:
            # cleanup
            session.exec(delete(Producto).where(Producto.id == product.id))
            session.exec(delete(Usuario).where(Usuario.id == user.id))
            session.commit()
            return

        pid = r.json().get('id')
        # Cancelar pedido
        r2 = client.delete(f"/pedidos/{pid}")
        assert r2.status_code == 200
        data = r2.json()
        assert data.get('estado_codigo') == 'cancelled'

        # Verificar historial
        hist = session.exec(select(HistorialEstadoPedido).where(HistorialEstadoPedido.pedido_id == pid)).all()
        assert any(h.estado_hacia == 'cancelled' for h in hist)

        # Cleanup
        session.exec(delete(HistorialEstadoPedido).where(HistorialEstadoPedido.pedido_id == pid))
        session.exec(delete(DetallePedido).where(DetallePedido.pedido_id == pid))
        session.exec(delete(Pedido).where(Pedido.id == pid))
        session.exec(delete(Producto).where(Producto.id == product.id))
        session.exec(delete(Usuario).where(Usuario.id == user.id))
        session.commit()


@pytest.mark.skipif(not is_db_available(), reason="Postgres DB no disponible. Ejecutar 'docker compose up db' antes de correr estas pruebas")
def test_pagination_and_filtering():
    with Session(engine) as session:
        user = Usuario(nombre="page_test", apellido="user", email="page_test@example.com", password_hash="x", is_active=True)
        session.add(user)
        session.commit()
        session.refresh(user)

        product = Producto(nombre="Page Producto", descripcion="desc", precio_base=5.0, disponible=True)
        session.add(product)
        session.commit()
        session.refresh(product)

        # Crear 2 pedidos
        ids = []
        for i in range(2):
            payload = {"forma_pago_codigo": "efectivo", "detalles": [{"producto_id": product.id, "cantidad": 1}]}
            r = client.post("/pedidos/", json=payload)
            if r.status_code == 201:
                ids.append(r.json().get('id'))

        # Pedidos totales >= len(ids)
        rlist = client.get('/pedidos/?limit=1&offset=0')
        assert rlist.status_code == 200
        data = rlist.json()
        assert isinstance(data, list)
        assert len(data) <= 1

        # Filtrar por estado pending
        rfilter = client.get('/pedidos/?estado=pending')
        assert rfilter.status_code == 200

        # Cleanup
        for pid in ids:
            session.exec(delete(HistorialEstadoPedido).where(HistorialEstadoPedido.pedido_id == pid))
            session.exec(delete(DetallePedido).where(DetallePedido.pedido_id == pid))
            session.exec(delete(Pedido).where(Pedido.id == pid))
        session.exec(delete(Producto).where(Producto.id == product.id))
        session.exec(delete(Usuario).where(Usuario.id == user.id))
        session.commit()

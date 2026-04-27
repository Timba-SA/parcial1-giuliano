from sqlmodel import SQLModel
from app.core.database import engine
from app.pedido.model import EstadoPedido, FormaPago
from app.rol.model import Rol


def init_db_extra():
    # crear tablas si no existen (ya hace SQLModel.metadata.create_all en core.database.init_db)
    SQLModel.metadata.create_all(engine)

    # Semillas para estados y formas de pago - insert if not exists
    from sqlmodel import Session, select

    estados = [
        {"codigo": "pending", "descripcion": "Pendiente", "orden": 1, "es_terminal": False},
        {"codigo": "paid", "descripcion": "Pagado", "orden": 2, "es_terminal": False},
        {"codigo": "shipped", "descripcion": "Enviado", "orden": 3, "es_terminal": False},
        {"codigo": "delivered", "descripcion": "Entregado", "orden": 4, "es_terminal": True},
        {"codigo": "cancelled", "descripcion": "Cancelado", "orden": 5, "es_terminal": True},
    ]

    formas = [
        {"codigo": "efectivo", "descripcion": "Efectivo", "activo": True},
        {"codigo": "tarjeta", "descripcion": "Tarjeta", "activo": True},
    ]

    roles = [
        {"codigo": "admin", "descripcion": "Administrador"},
        {"codigo": "empleado", "descripcion": "Empleado"},
        {"codigo": "cliente", "descripcion": "Cliente"},
    ]

    with Session(engine) as session:
        for e in estados:
            existing = session.get(EstadoPedido, e["codigo"])
            if not existing:
                session.add(EstadoPedido(**e))
        for f in formas:
            existing = session.get(FormaPago, f["codigo"])
            if not existing:
                session.add(FormaPago(**f))
        for r in roles:
            existing = session.get(Rol, r["codigo"])
            if not existing:
                session.add(Rol(**r))
        session.commit()

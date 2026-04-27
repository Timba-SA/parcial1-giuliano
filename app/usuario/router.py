from fastapi import APIRouter, Depends, HTTPException, Query, Path
from typing import Annotated, List
from sqlmodel import Session, select
from app.core.database import get_session
from app.usuario.schema import UsuarioCreate, UsuarioOut, UsuarioUpdate, UsuarioRolAsign, RolOut
from app.usuario.service import crear_usuario, update_usuario, delete_usuario
from app.usuario.model import Usuario, UsuarioRol
from app.rol.model import Rol

router = APIRouter(prefix="/usuarios", tags=["Usuarios"])


@router.post("/", response_model=UsuarioOut, status_code=201)
def create_user(
    user_in: UsuarioCreate,
    session: Session = Depends(get_session)
):
    return crear_usuario(session=session, user_in=user_in)


@router.get("/", response_model=List[UsuarioOut])
def list_users(
    skip: int = Query(default=0),
    limit: int = Query(default=100),
    session: Session = Depends(get_session)
):
    users = session.exec(select(Usuario).offset(skip).limit(limit)).all()
    return users


@router.get("/{id}", response_model=UsuarioOut)
def get_user(
    id: Annotated[int, Path(title="ID del usuario")],
    session: Session = Depends(get_session)
):
    user = session.get(Usuario, id)
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return user


@router.put("/{id}", response_model=UsuarioOut)
def update_user_route(
    id: int,
    user_in: UsuarioUpdate,
    session: Session = Depends(get_session)
):
    return update_usuario(session=session, user_id=id, user_in=user_in)


@router.delete("/{id}", status_code=204)
def delete_user_route(
    id: int,
    session: Session = Depends(get_session)
):
    delete_usuario(session=session, user_id=id)
    return None


# ── Gestión de roles de usuario ──────────────────────────────────────────────

@router.post("/{id}/roles", response_model=UsuarioOut, status_code=201)
def assign_role(
    id: int,
    body: UsuarioRolAsign,
    session: Session = Depends(get_session)
):
    user = session.get(Usuario, id)
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    rol = session.get(Rol, body.rol_codigo)
    if not rol:
        raise HTTPException(status_code=404, detail=f"Rol '{body.rol_codigo}' no existe")

    # Verificar si ya tiene el rol
    existing = session.exec(
        select(UsuarioRol).where(
            UsuarioRol.usuario_id == id,
            UsuarioRol.rol_codigo == body.rol_codigo
        )
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="El usuario ya tiene ese rol")

    session.add(UsuarioRol(usuario_id=id, rol_codigo=body.rol_codigo))
    session.commit()
    session.refresh(user)
    return user


@router.delete("/{id}/roles/{rol_codigo}", response_model=UsuarioOut)
def remove_role(
    id: int,
    rol_codigo: str,
    session: Session = Depends(get_session)
):
    user = session.get(Usuario, id)
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    link = session.exec(
        select(UsuarioRol).where(
            UsuarioRol.usuario_id == id,
            UsuarioRol.rol_codigo == rol_codigo
        )
    ).first()
    if not link:
        raise HTTPException(status_code=404, detail="El usuario no tiene ese rol")

    session.delete(link)
    session.commit()
    session.refresh(user)
    return user


# ── Roles disponibles ────────────────────────────────────────────────────────

roles_router = APIRouter(prefix="/roles", tags=["Roles"])


@roles_router.get("/", response_model=List[RolOut])
def list_roles(session: Session = Depends(get_session)):
    return session.exec(select(Rol)).all()

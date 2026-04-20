from fastapi import APIRouter, Depends, HTTPException, Query, Path
from typing import Annotated, List
from sqlmodel import Session, select
from app.core.database import get_session
from app.usuario.schema import UsuarioCreate, UsuarioOut, UsuarioUpdate
from app.usuario.service import crear_usuario, update_usuario, delete_usuario
from app.usuario.model import Usuario

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

@router.delete("/{id}", response_model=UsuarioOut)
def delete_user_route(
    id: int,
    session: Session = Depends(get_session)
):
    return delete_usuario(session=session, user_id=id)

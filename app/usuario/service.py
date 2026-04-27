from sqlmodel import Session, select
from fastapi import HTTPException, status
from app.usuario.model import Usuario, UsuarioRol
from app.usuario.schema import UsuarioCreate, UsuarioUpdate
from app.core.security import get_password_hash
from app.rol.model import Rol
from typing import Optional

def get_user_by_email(session: Session, email: str) -> Usuario | None:
    statement = select(Usuario).where(Usuario.email == email)
    return session.exec(statement).first()

def crear_usuario(session: Session, user_in: UsuarioCreate, rol_inicial: Optional[str] = None) -> Usuario:
    user = get_user_by_email(session, user_in.email)
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this email already exists in the system."
        )

    hashed_password = get_password_hash(user_in.password)

    db_user = Usuario(
        nombre=user_in.nombre,
        apellido=user_in.apellido,
        email=user_in.email,
        celular=user_in.celular,
        password_hash=hashed_password,
        is_active=True
    )
    session.add(db_user)
    session.commit()
    session.refresh(db_user)

    # Asignar rol inicial si se especifica
    if rol_inicial:
        rol = session.get(Rol, rol_inicial)
        if not rol:
            raise HTTPException(status_code=400, detail=f"Rol '{rol_inicial}' no existe")
        usuario_rol = UsuarioRol(usuario_id=db_user.id, rol_codigo=rol_inicial)
        session.add(usuario_rol)
        session.commit()
        session.refresh(db_user)

    return db_user

def update_usuario(session: Session, user_id: int, user_in: UsuarioUpdate) -> Usuario:
    user = session.get(Usuario, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user_data = user_in.model_dump(exclude_unset=True)
    for key, value in user_data.items():
        setattr(user, key, value)
        
    session.add(user)
    session.commit()
    session.refresh(user)
    return user

def delete_usuario(session: Session, user_id: int) -> Usuario:
    user = session.get(Usuario, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Soft delete
    user.is_active = False
    session.add(user)
    session.commit()
    session.refresh(user)
    return user

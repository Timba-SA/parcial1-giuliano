from fastapi import APIRouter, Depends, HTTPException, status, Query
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session
from datetime import timedelta
from typing import Annotated, Optional

from app.core.database import get_session
from app.core.security import ACCESS_TOKEN_EXPIRE_MINUTES, create_access_token, verify_password
from app.usuario.service import get_user_by_email, crear_usuario
from app.usuario.schema import Token, LoginRequest, UsuarioCreate, UsuarioOut

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/login", response_model=Token)
def login_for_access_token(
    login_data: LoginRequest,
    session: Session = Depends(get_session)
):
    user = get_user_by_email(session, login_data.email)
    if not user or not verify_password(login_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/signup", response_model=UsuarioOut, status_code=201)
def signup(
    user_in: UsuarioCreate,
    rol: Optional[str] = Query(default=None, description="Rol inicial: admin, empleado, cliente"),
    session: Session = Depends(get_session),
):
    existing_user = get_user_by_email(session, user_in.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El email ya está registrado"
        )

    new_user = crear_usuario(session=session, user_in=user_in, rol_inicial=rol)
    return new_user


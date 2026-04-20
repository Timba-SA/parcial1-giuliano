from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.core.database import init_db

# Import routers
from app.usuario.router import router as usuario_router
from app.api.routes.auth import router as auth_router

# Import models to ensure they are registered with SQLModel metadata
from app.usuario.model import Usuario, UsuarioRol
from app.rol.model import Rol
from app.direccion.model import DireccionEntrega

@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield

app = FastAPI(
    title="Identidad API",
    description="API para gestión de usuarios, roles y direcciones - Parcial 1",
    version="1.0.0",
    lifespan=lifespan
)

# Configuración CORS para el frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(usuario_router)
app.include_router(auth_router)

@app.get("/")
def read_root():
    return {"message": "Bienvenido a la API de Identidad"}

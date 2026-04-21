from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from contextlib import asynccontextmanager
from app.core.database import init_db
import logging

# Import routers
from app.usuario.router import router as usuario_router
from app.api.routes.auth import router as auth_router
from app.producto.router import (
    router as producto_router,
    router_ingredientes as ingrediente_router,
    router_categorias as categoria_router,
)

# Import models to ensure they are registered with SQLModel metadata
from app.usuario.model import Usuario, UsuarioRol
from app.rol.model import Rol
from app.direccion.model import DireccionEntrega
from app.producto.model import Producto, Ingrediente, ProductoCategoria, ProductoIngrediente
from app.pedido.router import router as pedido_router
from app.core.init_db import init_db_extra

@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    # Inicializar semillas específicas de pedidos (estados y formas de pago)
    try:
        init_db_extra()
    except Exception:
        # No bloquear el arranque si la semilla falla; dejar para revisión manual
        pass
    yield

app = FastAPI(
    title="Identidad API",
    description="API para gestión de usuarios, roles y direcciones - Parcial 1",
    version="1.0.0",
    lifespan=lifespan
)

# Handlers globales de excepciones
logger = logging.getLogger("uvicorn.error")


@app.exception_handler(ValueError)
async def value_error_handler(request, exc: ValueError):
    return JSONResponse(status_code=400, content={"detail": str(exc)})


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc: RequestValidationError):
    # Devuelve la lista de errores de validación
    return JSONResponse(status_code=422, content={"detail": exc.errors()})


@app.exception_handler(Exception)
async def general_exception_handler(request, exc: Exception):
    logger.exception("Unhandled exception: %s", exc)
    return JSONResponse(status_code=500, content={"detail": "Internal server error"})

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
app.include_router(producto_router)
app.include_router(ingrediente_router)
app.include_router(categoria_router)
app.include_router(pedido_router)

@app.get("/")
def read_root():
    return {"message": "Bienvenido a la API de Identidad"}

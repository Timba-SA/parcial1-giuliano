from fastapi import APIRouter, Depends, HTTPException, Query, Path, status
from typing import Annotated, List, Optional
from sqlmodel import Session, select
from app.core.database import get_session
from .model import Producto, Ingrediente, Categoria
from .schema import (
    ProductoCreate, ProductoOut, ProductoUpdate,
    IngredienteCreate, IngredienteOut, IngredienteUpdate,
    CategoriaCreate, CategoriaOut, CategoriaUpdate
)
from app.producto.service import ProductoService

router = APIRouter(prefix="/productos", tags=["Productos"])
router_ingredientes = APIRouter(prefix="/ingredientes", tags=["Ingredientes"])
router_categorias = APIRouter(prefix="/categorias", tags=["Categorias"])

# ==========================
# Endpoints para Ingredientes
# ==========================
@router_ingredientes.get("/", response_model=List[IngredienteOut])
def get_ingredientes(
    session: Session = Depends(get_session),
    skip: int = 0,
    limit: Annotated[int, Query(le=100)] = 50
):
    ingredientes = session.exec(select(Ingrediente).offset(skip).limit(limit)).all()
    return ingredientes

@router_ingredientes.get("/{id}", response_model=IngredienteOut)
def get_ingrediente(
    id: int = Path(...),
    session: Session = Depends(get_session)
):
    ingrediente = session.get(Ingrediente, id)
    if not ingrediente:
        raise HTTPException(status_code=404, detail="Ingrediente no encontrado")
    return ingrediente

@router_ingredientes.post("/", response_model=IngredienteOut)
def create_ingrediente(
    ingrediente_in: IngredienteCreate,
    session: Session = Depends(get_session)
):
    existente = session.exec(
        select(Ingrediente).where(Ingrediente.nombre == ingrediente_in.nombre)
    ).first()
    if existente:
        raise HTTPException(status_code=400, detail="Ya existe un ingrediente con ese nombre")

    ingrediente = Ingrediente.model_validate(ingrediente_in)
    session.add(ingrediente)
    session.commit()
    session.refresh(ingrediente)
    return ingrediente

@router_ingredientes.put("/{id}", response_model=IngredienteOut)
def update_ingrediente(
    id: int,
    ingrediente_in: IngredienteUpdate,
    session: Session = Depends(get_session)
):
    ingrediente = session.get(Ingrediente, id)
    if not ingrediente:
        raise HTTPException(status_code=404, detail="Ingrediente no encontrado")

    if ingrediente_in.nombre and ingrediente_in.nombre != ingrediente.nombre:
        existente = session.exec(
            select(Ingrediente).where(Ingrediente.nombre == ingrediente_in.nombre)
        ).first()
        if existente:
            raise HTTPException(status_code=400, detail="Ya existe un ingrediente con ese nombre")
    
    update_data = ingrediente_in.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(ingrediente, key, value)
        
    session.add(ingrediente)
    session.commit()
    session.refresh(ingrediente)
    return ingrediente

@router_ingredientes.delete("/{id}")
def delete_ingrediente(
    id: int,
    session: Session = Depends(get_session)
):
    try:
        ProductoService.delete_ingrediente(session, id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    return {"message": "Ingrediente eliminado"}


# ==========================
# Endpoints para Categorias
# ==========================
@router_categorias.get("/", response_model=List[CategoriaOut])
def get_categorias(
    session: Session = Depends(get_session),
    skip: int = 0,
    limit: Annotated[int, Query(ge=1, le=100)] = 50
):
    categorias = session.exec(
        select(Categoria).where(Categoria.activo == True)
        .offset(skip)
        .limit(limit)
    ).all()
    return categorias


@router_categorias.get("/{id}", response_model=CategoriaOut)
def get_categoria(
    id: Annotated[int, Path(ge=1)],
    session: Session = Depends(get_session)
):
    categoria = session.get(Categoria, id)
    if not categoria or not categoria.activo:
        raise HTTPException(status_code=404, detail="Categoría no encontrada")
    return categoria


@router_categorias.post("/", response_model=CategoriaOut, status_code=status.HTTP_201_CREATED)
def create_categoria(
    categoria_in: CategoriaCreate,
    session: Session = Depends(get_session)
):
    if categoria_in.parent_id is not None:
        parent = session.get(Categoria, categoria_in.parent_id)
        if not parent or not parent.activo:
            raise HTTPException(status_code=400, detail="La categoría padre no existe o no está activa")

    existente = session.exec(
        select(Categoria).where(Categoria.nombre == categoria_in.nombre)
    ).first()
    if existente:
        raise HTTPException(status_code=400, detail="Ya existe una categoría con ese nombre")

    categoria = Categoria.model_validate(categoria_in)
    session.add(categoria)
    session.commit()
    session.refresh(categoria)
    return categoria


@router_categorias.put("/{id}", response_model=CategoriaOut)
def update_categoria(
    id: Annotated[int, Path(ge=1)],
    categoria_in: CategoriaUpdate,
    session: Session = Depends(get_session)
):
    categoria = session.get(Categoria, id)
    if not categoria or not categoria.activo:
        raise HTTPException(status_code=404, detail="Categoría no encontrada")

    update_data = categoria_in.model_dump(exclude_unset=True)

    if "parent_id" in update_data:
        parent_id = update_data["parent_id"]
        if parent_id == id:
            raise HTTPException(status_code=400, detail="Una categoría no puede ser su propia padre")
        if parent_id is not None:
            parent = session.get(Categoria, parent_id)
            if not parent or not parent.activo:
                raise HTTPException(status_code=400, detail="La categoría padre no existe")

    if "nombre" in update_data and update_data["nombre"] != categoria.nombre:
        existente = session.exec(
            select(Categoria).where(Categoria.nombre == update_data["nombre"])
        ).first()
        if existente:
            raise HTTPException(status_code=400, detail="Ya existe una categoría con ese nombre")

    for key, value in update_data.items():
        setattr(categoria, key, value)

    session.add(categoria)
    session.commit()
    session.refresh(categoria)
    return categoria


@router_categorias.delete("/{id}")
def delete_categoria(
    id: Annotated[int, Path(ge=1)],
    session: Session = Depends(get_session)
):
    try:
        ProductoService.delete_categoria(session, id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    return {"message": "Categoría eliminada lógicamente"}


# ==========================
# Endpoints para Productos
# ==========================
@router.get("/", response_model=List[ProductoOut])
def get_productos(
    session: Session = Depends(get_session),
    limit: Annotated[int, Query(le=100)] = 50
):
    # ACADEMIC RESTRICTION for GET / of productos: MUST keep exactly limit: Annotated[int, Query(le=100)] = 50.
    return ProductoService.get_productos(session, limit=limit)

@router.get("/{id}", response_model=ProductoOut)
def get_producto(
    id: int = Path(...),
    session: Session = Depends(get_session)
):
    try:
        return ProductoService.get_producto(session, id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.post("/", response_model=ProductoOut)
def create_producto(
    producto_in: ProductoCreate,
    session: Session = Depends(get_session)
):
    try:
        return ProductoService.create_producto(session, producto_in)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.put("/{id}", response_model=ProductoOut)
def update_producto(
    id: int,
    producto_in: ProductoUpdate,
    session: Session = Depends(get_session)
):
    try:
        return ProductoService.update_producto(session, id, producto_in)
    except ValueError as e:
        if str(e) == "Producto no encontrado":
            raise HTTPException(status_code=404, detail=str(e))
        raise HTTPException(status_code=400, detail=str(e))


@router.patch("/{id}/disponibilidad", response_model=ProductoOut)
def update_producto_disponibilidad(
    id: int,
    disponible: bool = Query(...),
    session: Session = Depends(get_session)
):
    try:
        return ProductoService.update_disponibilidad(session, id, disponible)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.delete("/{id}")
def delete_producto(
    id: int,
    session: Session = Depends(get_session)
):
    try:
        ProductoService.delete_producto(session, id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    return {"message": "Producto eliminado lógicamente"}

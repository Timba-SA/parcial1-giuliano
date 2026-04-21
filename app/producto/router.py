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
    ingrediente = session.get(Ingrediente, id)
    if not ingrediente:
        raise HTTPException(status_code=404, detail="Ingrediente no encontrado")

    if ingrediente.productos:
        raise HTTPException(
            status_code=400,
            detail="No se puede eliminar un ingrediente que está asociado a productos"
        )
    
    session.delete(ingrediente)
    session.commit()
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
        select(Categoria)
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
    if not categoria:
        raise HTTPException(status_code=404, detail="Categoría no encontrada")
    return categoria


@router_categorias.post("/", response_model=CategoriaOut, status_code=status.HTTP_201_CREATED)
def create_categoria(
    categoria_in: CategoriaCreate,
    session: Session = Depends(get_session)
):
    if categoria_in.parent_id is not None:
        parent = session.get(Categoria, categoria_in.parent_id)
        if not parent:
            raise HTTPException(status_code=400, detail="La categoría padre no existe")

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
    if not categoria:
        raise HTTPException(status_code=404, detail="Categoría no encontrada")

    update_data = categoria_in.model_dump(exclude_unset=True)

    if "parent_id" in update_data:
        parent_id = update_data["parent_id"]
        if parent_id == id:
            raise HTTPException(status_code=400, detail="Una categoría no puede ser su propia padre")
        if parent_id is not None:
            parent = session.get(Categoria, parent_id)
            if not parent:
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
    categoria = session.get(Categoria, id)
    if not categoria:
        raise HTTPException(status_code=404, detail="Categoría no encontrada")

    tiene_subcategorias = session.exec(
        select(Categoria).where(Categoria.parent_id == id)
    ).first()
    if tiene_subcategorias:
        raise HTTPException(
            status_code=400,
            detail="No se puede eliminar una categoría con subcategorías asociadas"
        )

    if categoria.productos:
        raise HTTPException(
            status_code=400,
            detail="No se puede eliminar una categoría que está asociada a productos"
        )

    session.delete(categoria)
    session.commit()
    return {"message": "Categoría eliminada"}


# ==========================
# Endpoints para Productos
# ==========================
@router.get("/", response_model=List[ProductoOut])
def get_productos(
    session: Session = Depends(get_session),
    skip: int = 0,
    limit: Annotated[int, Query(le=100)] = 50,
    disponible: Optional[bool] = None
):
    query = select(Producto)
    if disponible is not None:
        query = query.where(Producto.disponible == disponible)
    
    productos = session.exec(query.offset(skip).limit(limit)).all()
    return productos

@router.get("/{id}", response_model=ProductoOut)
def get_producto(
    id: int = Path(...),
    session: Session = Depends(get_session)
):
    producto = session.get(Producto, id)
    if not producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return producto

@router.post("/", response_model=ProductoOut)
def create_producto(
    producto_in: ProductoCreate,
    session: Session = Depends(get_session)
):
    ingredientes = []
    categorias = []

    if producto_in.ingrediente_ids:
        ingredientes = session.exec(
            select(Ingrediente).where(Ingrediente.id.in_(producto_in.ingrediente_ids))
        ).all()
        if len(ingredientes) != len(set(producto_in.ingrediente_ids)):
            raise HTTPException(status_code=400, detail="Uno o más ingredientes no existen")

    if producto_in.categoria_ids:
        categorias = session.exec(
            select(Categoria).where(Categoria.id.in_(producto_in.categoria_ids))
        ).all()
        if len(categorias) != len(set(producto_in.categoria_ids)):
            raise HTTPException(status_code=400, detail="Una o más categorías no existen")

    producto = Producto(
        nombre=producto_in.nombre,
        descripcion=producto_in.descripcion,
        precio_base=producto_in.precio_base,
        tiempo_prep_min=producto_in.tiempo_prep_min,
        disponible=producto_in.disponible
    )
    producto.ingredientes = list(ingredientes)
    producto.categorias = list(categorias)

    session.add(producto)
    session.commit()
    session.refresh(producto)
    return producto


@router.put("/{id}", response_model=ProductoOut)
def update_producto(
    id: int,
    producto_in: ProductoUpdate,
    session: Session = Depends(get_session)
):
    producto = session.get(Producto, id)
    if not producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")

    update_data = producto_in.model_dump(exclude_unset=True, exclude={"categoria_ids", "ingrediente_ids"})
    for key, value in update_data.items():
        setattr(producto, key, value)

    # Update ingredientes
    if producto_in.ingrediente_ids is not None:
        ingredientes = session.exec(
            select(Ingrediente).where(Ingrediente.id.in_(producto_in.ingrediente_ids))
        ).all() if producto_in.ingrediente_ids else []

        if len(ingredientes) != len(set(producto_in.ingrediente_ids or [])):
            raise HTTPException(status_code=400, detail="Uno o más ingredientes no existen")

        producto.ingredientes = list(ingredientes)

    # Update categorías
    if producto_in.categoria_ids is not None:
        categorias = session.exec(
            select(Categoria).where(Categoria.id.in_(producto_in.categoria_ids))
        ).all() if producto_in.categoria_ids else []

        if len(categorias) != len(set(producto_in.categoria_ids or [])):
            raise HTTPException(status_code=400, detail="Una o más categorías no existen")

        producto.categorias = list(categorias)

    session.add(producto)
    session.commit()
    session.refresh(producto)
    return producto


@router.patch("/{id}/stock", response_model=ProductoOut)
def update_producto_stock(
    id: int,
    stock: int = Query(..., ge=0),
    session: Session = Depends(get_session)
):
    producto = session.get(Producto, id)
    if not producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")

    # El modelo Producto no tiene campo stock. Se usa stock derivado para disponibilidad.
    producto.disponible = stock > 0
    session.add(producto)
    session.commit()
    session.refresh(producto)
    return producto


@router.delete("/{id}")
def delete_producto(
    id: int,
    session: Session = Depends(get_session)
):
    producto = session.get(Producto, id)
    if not producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")

    session.delete(producto)
    session.commit()
    return {"message": "Producto eliminado"}

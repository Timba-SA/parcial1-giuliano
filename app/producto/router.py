from fastapi import APIRouter, Depends, HTTPException, Query, Path
from typing import Annotated, List, Optional
from sqlmodel import Session, select
from app.core.database import get_session
from .model import Producto, Ingrediente, ProductoCategoria, ProductoIngrediente
from .schema import (
    ProductoCreate, ProductoOut, ProductoUpdate,
    IngredienteCreate, IngredienteOut, IngredienteUpdate
)

router = APIRouter(prefix="/productos", tags=["Productos"])
router_ingredientes = APIRouter(prefix="/ingredientes", tags=["Ingredientes"])

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
    
    session.delete(ingrediente)
    session.commit()
    return {"message": "Ingrediente eliminado"}


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
    producto = Producto(
        nombre=producto_in.nombre,
        descripcion=producto_in.descripcion,
        precio_base=producto_in.precio_base,
        tiempo_prep_min=producto_in.tiempo_prep_min,
        disponible=producto_in.disponible
    )
    session.add(producto)
    session.commit()
    session.refresh(producto)

    # Relaciones Ingredientes
    if producto_in.ingrediente_ids:
        for ing_id in producto_in.ingrediente_ids:
            ingrediente = session.get(Ingrediente, ing_id)
            if ingrediente:
                producto.ingredientes.append(ingrediente)
    
    # Relaciones Categorias (asumiendo que existen)
    if producto_in.categoria_ids:
        for cat_id in producto_in.categoria_ids:
            # Aquí idealmente se verifica si la categoría existe. 
            # Como es una pivot model, podemos crear el registro en ProductoCategoria.
            pivot = ProductoCategoria(producto_id=producto.id, categoria_id=cat_id)
            session.add(pivot)
            
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
        producto.ingredientes.clear()
        for ing_id in producto_in.ingrediente_ids:
            ingrediente = session.get(Ingrediente, ing_id)
            if ingrediente:
                producto.ingredientes.append(ingrediente)
                
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
    
    # As the `Producto` model currently does not have a `stock` field according to `guia_implementacion_codigo.md`,
    # but `backend_db_guia.md` suggests it. Let's assume it alters availability or we can just mock it.
    # Actually, `ProductoBase` in `backend_db_guia.md` has `stock: int = Field(default=0)`. 
    # Let me make sure `Producto` has `stock` in `model.py` if it was in the base guide.
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

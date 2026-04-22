from sqlmodel import Session, select
from typing import List, Optional
from app.producto.model import Producto, Categoria, Ingrediente, ProductoCategoria, ProductoIngrediente
from app.producto.schema import (
    ProductoCreate, ProductoUpdate, ProductoOut,
    ProductoCategoriaDetailOut, ProductoIngredienteDetailOut
)

class ProductoService:
    @staticmethod
    def _build_producto_out(session: Session, producto: Producto) -> ProductoOut:
        # Fetch relationships manually to include pivot data
        categorias_out = []
        pivot_cats = session.exec(select(ProductoCategoria).where(ProductoCategoria.producto_id == producto.id)).all()
        for pc in pivot_cats:
            cat = session.get(Categoria, pc.categoria_id)
            if cat:
                categorias_out.append(ProductoCategoriaDetailOut(
                    id=cat.id,
                    nombre=cat.nombre,
                    descripcion=cat.descripcion,
                    orden_display=cat.orden_display,
                    activo=cat.activo,
                    created_at=cat.created_at,
                    es_principal=pc.es_principal
                ))
                
        ingredientes_out = []
        pivot_ings = session.exec(select(ProductoIngrediente).where(ProductoIngrediente.producto_id == producto.id)).all()
        for pi in pivot_ings:
            ing = session.get(Ingrediente, pi.ingrediente_id)
            if ing:
                ingredientes_out.append(ProductoIngredienteDetailOut(
                    id=ing.id,
                    nombre=ing.nombre,
                    descripcion=ing.descripcion,
                    stock=ing.stock,
                    unidad_medida=ing.unidad_medida,
                    es_removible=pi.es_removible,
                    es_opcional=pi.es_opcional
                ))
                
        return ProductoOut(
            id=producto.id,
            nombre=producto.nombre,
            descripcion=producto.descripcion,
            precio_base=producto.precio_base,
            tiempo_prep_min=producto.tiempo_prep_min,
            disponible=producto.disponible,
            created_at=producto.created_at,
            categorias=categorias_out,
            ingredientes=ingredientes_out
        )

    @classmethod
    def get_productos(cls, session: Session, limit: int = 50) -> List[ProductoOut]:
        productos = session.exec(select(Producto).where(Producto.disponible == True).limit(limit)).all()
        return [cls._build_producto_out(session, p) for p in productos]

    @classmethod
    def get_producto(cls, session: Session, producto_id: int) -> ProductoOut:
        producto = session.get(Producto, producto_id)
        if not producto or not producto.disponible:
            raise ValueError("Producto no encontrado")
        return cls._build_producto_out(session, producto)

    @classmethod
    def create_producto(cls, session: Session, data: ProductoCreate) -> ProductoOut:
        # Validate categories
        for cat_data in data.categorias:
            if not session.get(Categoria, cat_data.categoria_id):
                raise ValueError(f"Categoria {cat_data.categoria_id} no existe")
                
        # Validate ingredients
        for ing_data in data.ingredientes:
            if not session.get(Ingrediente, ing_data.ingrediente_id):
                raise ValueError(f"Ingrediente {ing_data.ingrediente_id} no existe")
                
        producto = Producto(
            nombre=data.nombre,
            descripcion=data.descripcion,
            precio_base=data.precio_base,
            tiempo_prep_min=data.tiempo_prep_min,
            disponible=data.disponible
        )
        session.add(producto)
        session.commit()
        session.refresh(producto)
        
        # Add pivot entries manually
        for cat_data in data.categorias:
            pc = ProductoCategoria(
                producto_id=producto.id,
                categoria_id=cat_data.categoria_id,
                es_principal=cat_data.es_principal
            )
            session.add(pc)
            
        for ing_data in data.ingredientes:
            pi = ProductoIngrediente(
                producto_id=producto.id,
                ingrediente_id=ing_data.ingrediente_id,
                es_removible=ing_data.es_removible,
                es_opcional=ing_data.es_opcional
            )
            session.add(pi)
            
        session.commit()
        return cls._build_producto_out(session, producto)

    @classmethod
    def update_producto(cls, session: Session, producto_id: int, data: ProductoUpdate) -> ProductoOut:
        producto = session.get(Producto, producto_id)
        if not producto or not producto.disponible:
            raise ValueError("Producto no encontrado")
            
        update_data = data.dict(exclude_unset=True, exclude={"categorias", "ingredientes"})
        for key, value in update_data.items():
            setattr(producto, key, value)
            
        if data.categorias is not None:
            for cat_data in data.categorias:
                if not session.get(Categoria, cat_data.categoria_id):
                    raise ValueError(f"Categoria {cat_data.categoria_id} no existe")
            
            # Clear old and add new
            old_cats = session.exec(select(ProductoCategoria).where(ProductoCategoria.producto_id == producto.id)).all()
            for oc in old_cats:
                session.delete(oc)
            
            for cat_data in data.categorias:
                pc = ProductoCategoria(
                    producto_id=producto.id,
                    categoria_id=cat_data.categoria_id,
                    es_principal=cat_data.es_principal
                )
                session.add(pc)
                
        if data.ingredientes is not None:
            for ing_data in data.ingredientes:
                if not session.get(Ingrediente, ing_data.ingrediente_id):
                    raise ValueError(f"Ingrediente {ing_data.ingrediente_id} no existe")
                    
            # Clear old and add new
            old_ings = session.exec(select(ProductoIngrediente).where(ProductoIngrediente.producto_id == producto.id)).all()
            for oi in old_ings:
                session.delete(oi)
                
            for ing_data in data.ingredientes:
                pi = ProductoIngrediente(
                    producto_id=producto.id,
                    ingrediente_id=ing_data.ingrediente_id,
                    es_removible=ing_data.es_removible,
                    es_opcional=ing_data.es_opcional
                )
                session.add(pi)
                
        session.commit()
        return cls._build_producto_out(session, producto)

    @classmethod
    def delete_producto(cls, session: Session, producto_id: int) -> None:
        producto = session.get(Producto, producto_id)
        if not producto or not producto.disponible:
            raise ValueError("Producto no encontrado")
        producto.disponible = False
        session.commit()
        
    @classmethod
    def delete_categoria(cls, session: Session, categoria_id: int) -> None:
        categoria = session.get(Categoria, categoria_id)
        if not categoria or not categoria.activo:
            raise ValueError("Categoria no encontrada")
        categoria.activo = False
        session.commit()
        
    @classmethod
    def delete_ingrediente(cls, session: Session, ingrediente_id: int) -> None:
        ingrediente = session.get(Ingrediente, ingrediente_id)
        if not ingrediente:
            raise ValueError("Ingrediente no encontrado")
        # Soft delete por convención si no hay campo activo
        ingrediente.stock = 0
        session.commit()

    @classmethod
    def update_disponibilidad(cls, session: Session, producto_id: int, disponible: bool) -> ProductoOut:
        producto = session.get(Producto, producto_id)
        if not producto:
            raise ValueError("Producto no encontrado")
        producto.disponible = disponible
        session.commit()
        return cls._build_producto_out(session, producto)

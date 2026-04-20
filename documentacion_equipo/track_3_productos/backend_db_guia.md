# Guía de Backend: Track 3 - Productos

## Modelos (SQLModel)
- **Product**:
  ```python
  class ProductBase(SQLModel):
      name: str = Field(index=True)
      description: str | None = None
      price: float
      stock: int = Field(default=0)
      category_id: int | None = Field(default=None, foreign_key="category.id")
      brand_id: int | None = Field(default=None, foreign_key="brand.id")
  
  class Product(ProductBase, table=True):
      id: Optional[int] = Field(default=None, primary_key=True)
      category: Optional["Category"] = Relationship(back_populates="products")
      brand: Optional["Brand"] = Relationship(back_populates="products")
  ```

## Endpoints (FastAPI)
- `GET /products/`: Listar productos (con paginación y filtros opcionales por categoría/marca con `Query`).
- `GET /products/{id}`: Detalle de producto (`Path`).
- `POST /products/`: Crear producto.
- `PUT /products/{id}`: Actualizar.
- `DELETE /products/{id}`: Eliminar lógicamente o físicamente.
- `PATCH /products/{id}/stock`: Ajuste de inventario.

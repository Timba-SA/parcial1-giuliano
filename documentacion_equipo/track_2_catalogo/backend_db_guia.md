# Guía de Backend: Track 2 - Catálogo

## Modelos (SQLModel)
- **Category**:
  ```python
  class CategoryBase(SQLModel):
      name: str = Field(index=True)
      description: str | None = None
  
  class Category(CategoryBase, table=True):
      id: Optional[int] = Field(default=None, primary_key=True)
      products: list["Product"] = Relationship(back_populates="category")
  ```
- **Brand**:
  ```python
  class BrandBase(SQLModel):
      name: str = Field(index=True, unique=True)
      website: str | None = None
  
  class Brand(BrandBase, table=True):
      id: Optional[int] = Field(default=None, primary_key=True)
      products: list["Product"] = Relationship(back_populates="brand")
  ```

## Endpoints (FastAPI)
- `GET /categories/`: Obtener categorías (paginado).
- `POST /categories/`: Crear categoría.
- `PUT /categories/{id}`: Actualizar.
- `DELETE /categories/{id}`: Eliminar.
- `GET /brands/`: Listar marcas.
- `POST /brands/`: Crear marca.
- `PUT /brands/{id}`: Actualizar.
- `DELETE /brands/{id}`: Eliminar.

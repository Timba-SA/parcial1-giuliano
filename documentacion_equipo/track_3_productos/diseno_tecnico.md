# Diseño Técnico: Track 3 - Productos

## Backend Architecture
**Archivos a Crear/Modificar:**
- `app/models/product_model.py`: Modelo SQLAlchemy para Productos.
- `app/schemas/product_schema.py`: Pydantic schemas (ProductCreate, ProductResponse, ProductUpdate).
- `app/services/product_service.py`: Lógica de inventario y gestión de producto, validación de stock o precios.
- `app/routers/product_router.py`: Endpoints de FastAPI (`/products`).

**Relaciones:**
- Producto (N) a Categoría (1).
- Producto (1) a Detalles de Pedido (N).

## Frontend Component Tree
**Páginas:**
- `pages/ProductsPage.tsx`: Vista principal de productos e inventario.

**Componentes:**
- `components/products/ProductGrid.tsx` o `components/products/ProductTable.tsx`: Tabla o grilla de productos.
- `components/products/ProductModal.tsx`: Modal para crear/editar productos.
- `components/products/ProductForm.tsx`: Formulario de datos con selección de categoría.

**TanStack Query:**
- `useQuery` para el listado (`GET /products`). Clave: `['products']`.
- `useMutation` para agregar/editar (`POST/PUT /products`), llamando a `invalidateQueries(['products'])`.
# Diseño Técnico: Track 2 - Catálogo

## Backend Architecture
**Archivos a Crear/Modificar:**
- `app/models/category_model.py`: Modelo SQLAlchemy de Categorías.
- `app/schemas/category_schema.py`: Pydantic schemas (CategoryCreate, CategoryResponse, CategoryUpdate).
- `app/services/category_service.py`: Lógica de negocio para categorías (jerarquía si aplica).
- `app/routers/category_router.py`: Endpoints de FastAPI (`/categories`).

**Relaciones:**
- Categoría (1) a Productos (N).

## Frontend Component Tree
**Páginas:**
- `pages/CatalogPage.tsx`: Gestión de categorías o árbol de catálogo.

**Componentes:**
- `components/catalog/CategoryList.tsx`: Listado de categorías.
- `components/catalog/CategoryModal.tsx`: Modal para crear/editar categorías.
- `components/catalog/CategoryForm.tsx`: Formulario de categoría.

**TanStack Query:**
- `useQuery` para obtener la lista de categorías (`GET /categories`). Clave: `['categories']`.
- `useMutation` para persistencia (`POST/PUT /categories`), seguido de `invalidateQueries(['categories'])`.
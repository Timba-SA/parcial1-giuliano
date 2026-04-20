# Diseño Técnico: Track 1 - Identidad

## Backend Architecture
**Archivos a Crear/Modificar:**
- `app/models/user_model.py`: Definición de SQLAlchemy para Usuario.
- `app/schemas/user_schema.py`: Pydantic schemas para Request y Response (UserCreate, UserResponse).
- `app/services/user_service.py`: Lógica de negocio (CRUD de usuarios, validaciones).
- `app/routers/user_router.py`: Endpoints de FastAPI (`/users`).

**Relaciones:**
- Usuario (1) a Roles (N) si aplica, o perfil de usuario con permisos básicos.

## Frontend Component Tree
**Páginas:**
- `pages/UsersPage.tsx`: Lista principal de usuarios.

**Componentes:**
- `components/users/UserList.tsx`: Tabla o listado de usuarios.
- `components/users/UserModal.tsx`: Modal para crear/editar usuarios.
- `components/users/UserForm.tsx`: Formulario de captura de datos.

**TanStack Query:**
- `useQuery` para obtener usuarios (`GET /users`). Clave: `['users']`.
- `useMutation` para crear/actualizar (`POST/PUT /users`), seguido de `invalidateQueries(['users'])`.
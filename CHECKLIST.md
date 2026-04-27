## Lista de Verificación del Proyecto Integrador

### Backend (FastAPI + SQLModel)

- [x] **Entorno**: Uso de Docker + requirements.txt y FastAPI funcionando en modo dev (puerto 8000).

- [x] **Modelado**: Tablas creadas con SQLModel incluyendo relaciones `Relationship` (1:N y N:N).
  - `Producto` ↔ `Categoria` vía `ProductoCategoria` (N:N)
  - `Producto` ↔ `Ingrediente` vía `ProductoIngrediente` (N:N)
  - `Usuario` ↔ `Rol` vía `UsuarioRol` (N:N)
  - `Usuario` → `DireccionEntrega` (1:N)

- [x] **Validación**: Uso de `Annotated`, `Query` y `Path` para reglas de negocio (longitudes, rangos, paginación).

- [x] **CRUD Persistente**: Endpoints funcionales para Crear, Leer, Actualizar y Borrar en PostgreSQL para todos los módulos (usuarios, productos, categorías, ingredientes, pedidos).

- [x] **Seguridad de Datos**: Implementación de `response_model` para no filtrar datos sensibles.
  - `UsuarioOut` no expone `password_hash`
  - `Token` en auth

- [x] **Estructura**: Código organizado por módulos (`router.py`, `schema.py`, `service.py`, `model.py`) en `app/usuario`, `app/producto`, `app/pedido`.

---

### Frontend (React + TypeScript + Tailwind)

- [x] **Setup**: Proyecto creado con Vite + TS y estructura de carpetas limpia (`pages/`, `components/`, `hooks/`).

- [x] **Componentes**: Uso de componentes funcionales y Props debidamente tipadas con interfaces TypeScript.

- [x] **Estilos**: Interfaz construida íntegramente con clases de utilidad de Tailwind CSS 4.

- [x] **Navegación**: Configuración de `react-router-dom` con ruta dinámica:
  - `/productos/:id` → `ProductoDetallePage` con `useParams`
  - `/mis-pedidos/:id` → `OrderDetallePage` con `useParams`

- [x] **Estado Local**: Uso de `useState` para el manejo de formularios y UI interactiva.

---

### Integración y Server State

- [x] **Lectura (useQuery)**: Listados y detalles consumiendo datos reales de la API (sin mocks).

- [x] **Escritura (useMutation)**: Formularios que envían datos al backend con éxito (crear/editar/borrar).

- [x] **Sincronización**: Uso de `invalidateQueries` para refrescar la UI automáticamente tras un cambio.

- [x] **Feedback**: Gestión visual de estados "Cargando..." y "Error" en todas las peticiones.

---

### Video de Presentación

- [ ] **Duración**: El video dura 15 minutos o menos.

- [ ] **Audio/Video**: La voz es clara y la resolución de pantalla permite leer el código.

- [ ] **Demo**: Se muestra el flujo completo desde la creación hasta la persistencia en la DB.

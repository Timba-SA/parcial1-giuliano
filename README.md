# Parcial 1 — Sistema de Pedidos Online 🚀

**Alumno:** Giuliano  
**Materia:** Programación IV  
**Entrega:** Parcial 1

---

## 📌 Descripción del Proyecto

Sistema fullstack de gestión de pedidos online que integra:

- **Identidad y accesos**: Registro, login con JWT, gestión de usuarios y asignación de roles (admin, empleado, cliente).
- **Catálogo de productos**: CRUD completo de productos con categorías e ingredientes relacionados (N:N).
- **Carrito y pedidos**: Checkout con selección de productos, forma de pago y seguimiento de estado del pedido.
- **Perfil de usuario**: Vista de datos personales, roles asignados y pedidos realizados.

### Stack técnico

| Capa | Tecnología |
|------|-----------|
| Backend | FastAPI + SQLModel + PostgreSQL |
| Frontend | React + TypeScript + Vite + Tailwind CSS 4 |
| ORM | SQLModel (Pydantic + SQLAlchemy) |
| Estado servidor | TanStack Query (React Query v5) |
| Navegación | React Router DOM v6 |
| Auth | JWT (python-jose + bcrypt) |
| Infraestructura | Docker Compose (3 contenedores) |

### Relaciones implementadas

- `Producto` ↔ `Categoria` vía `ProductoCategoria` **(N:N)**
- `Producto` ↔ `Ingrediente` vía `ProductoIngrediente` **(N:N)**
- `Usuario` ↔ `Rol` vía `UsuarioRol` **(N:N)**
- `Usuario` → `DireccionEntrega` **(1:N)**
- `Pedido` → `DetallePedido` **(1:N)**

---

## 🎬 Video de Presentación

> 🔗 **Link al video:** *(agregar link de YouTube/Drive aquí antes de la entrega)*

---

## 🛠️ Requisitos Previos

Lo único que necesitás tener instalado es:

1. **[Docker Desktop](https://www.docker.com/products/docker-desktop/)** (asegurate de que el motor esté corriendo).
2. **VS Code** (o tu editor favorito).
3. La extensión **"SQLTools"** + driver **"SQLTools PostgreSQL/Redshift Driver"** para ver la DB desde el editor.

---

## 🚀 Cómo levantar el proyecto

En la terminal (parado en la raíz del proyecto, donde está el `docker-compose.yml`):

```bash
docker compose up --build -d
```

**¿Qué levanta?**
- `parcial1_postgres` → Motor de base de datos en el puerto **5432**.
- `parcial1_backend` → API FastAPI en el puerto **8000** (auto-documentada en Swagger).
- `parcial1_frontend` → App React/Vite en el puerto **5173**.

### 🔗 URLs de acceso

| Servicio | URL |
|----------|-----|
| **Frontend (Web App)** | [http://localhost:5173](http://localhost:5173) |
| **Swagger API Docs** | [http://localhost:8000/docs](http://localhost:8000/docs) |
| **ReDoc API Docs** | [http://localhost:8000/redoc](http://localhost:8000/redoc) |

---

## 💾 Conexión a la Base de Datos (para el video)

Para mostrar las consultas SQL en el video usando la extensión **SQLTools** de VS Code:

1. Abrir el panel lateral de SQLTools → **Add New Connection** → elegir el ícono del elefante (PostgreSQL).
2. Completar **EXACTAMENTE** con estos datos:
   - **Server Address:** `localhost`
   - **Port:** `5432`
   - **Database:** `parcial1_db`
   - **Username:** `postgres`
   - **Password:** `postgres`
3. Clic en **TEST CONNECTION** → **SAVE CONNECTION**.

---

## 🛑 Detener el proyecto

```bash
docker compose down
```

> **Nota:** Los datos persisten gracias al volumen `postgres_data`. Para borrar todo y empezar de cero: `docker compose down -v`

---

## 📁 Estructura del proyecto

```
parcial1-giuliano/
├── app/                    # Backend FastAPI
│   ├── core/               # DB, seguridad, init
│   ├── usuario/            # Módulo identidad (model, schema, service, router)
│   ├── rol/                # Módulo roles
│   ├── producto/           # Módulo catálogo (productos, categorías, ingredientes)
│   ├── pedido/             # Módulo pedidos
│   ├── direccion/          # Módulo direcciones
│   └── api/routes/         # Auth (login/signup)
├── frontend/               # Frontend React + Vite + TS
│   └── src/
│       ├── pages/          # Páginas principales
│       ├── components/     # Componentes reutilizables
│       └── hooks/          # Custom hooks (TanStack Query)
├── docker-compose.yml
├── CHECKLIST.md
└── README.md
```

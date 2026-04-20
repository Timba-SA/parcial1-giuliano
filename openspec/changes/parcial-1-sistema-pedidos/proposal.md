# Proposal: Parcial 1 - Sistema de Pedidos (4 Tracks)

## Intent
Deliver a complete Fullstack (FastAPI + React) application for "Parcial 1", satisfying all rubric requirements (CRUD, relationships, caching, routing). To accommodate the 4-person team constraint, the system is architected around 4 balanced "Fullstack Vertical Tracks", allowing parallel development without merge conflicts.

## Scope

### In Scope
- **Track 1: Identity & Users**: `Usuario`, `Rol`, `DireccionEntrega` models, endpoints, and UI management.
- **Track 2: Catalog**: `Categoria` and `Ingrediente` domains (CRUD, hierarchical categories, allergens) and UI pages.
- **Track 3: Products & Relationships**: `Producto`, `ProductoCategoria`, `ProductoIngrediente` domains (Complex relationships, pricing, available flags) and UI detail pages.
- **Track 4: Orders & Traceability**: `Pedido`, `DetallePedido`, `HistorialEstadoPedido` domains (State machine, snapshots, checkout flow) and UI tracking.
- Integration: PostgreSQL (SQLModel), FastAPI routers, React Router SPA, TanStack Query mutations/caching.

### Out of Scope
- Real payment gateway integration.
- Real-time WebSockets (polling or manual refresh instead).
- Advanced inventory management (stock is explicitly excluded per ERD).

## Capabilities

### New Capabilities
- `identity`: User, Roles, and Delivery Addresses management.
- `catalog`: Categories and Ingredients CRUD.
- `products`: Product management including many-to-many relationships with ingredients and categories.
- `orders`: Order checkout, historical snapshotting, and state machine transitions.

### Modified Capabilities
None

## Approach
We will utilize the **FastAPI Domain-Driven (Modular) Architecture** where each Track owner gets their own isolated `app/<domain>/` folder containing `model.py`, `schema.py`, `service.py`, and `router.py`. In the Frontend, each track owner gets their own `/src/pages/<domain>/` and `/src/components/<domain>/` directories. 
This vertical slice approach ensures that Developer A working on Categories doesn't touch Developer B's code for Orders. The only intersection points are `app/main.py` (to register routers) and the React Router configuration, making parallel development highly efficient and collision-free.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `backend/app/usuario/` | New | Track 1 isolated domain |
| `backend/app/categoria/`, `ingrediente/` | New | Track 2 isolated domains |
| `backend/app/producto/` | New | Track 3 isolated domain |
| `backend/app/pedido/` | New | Track 4 isolated domain |
| `frontend/src/pages/` | New | UI Pages per domain |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Merge conflicts in `main.py` | High | Pre-agree on router import structure; minimal lines changed. |
| Foreign Key violations across domains | Med | Define DB seeders/order of execution (Users -> Catalog -> Products -> Orders). |
| Inconsistent UI/UX | Med | Use shared generic Tailwind components (Buttons, Modals, Tables). |

## Rollback Plan
Since this is a greenfield project for an exam, rollback consists of reverting the `main` branch to the latest stable commit and dropping/recreating the local PostgreSQL schema via SQLModel `metadata.create_all()`.

## Dependencies
- FastAPI, SQLModel, PostgreSQL
- React, Vite, Tailwind CSS 4, TanStack Query, React Router DOM

## Success Criteria
- [ ] 4 distinct backend modules working independently but relating at the DB level.
- [ ] 4 distinct frontend page groups consuming their respective endpoints via `useQuery` and `useMutation`.
- [ ] Successful 15-minute video demo showcasing architecture, code, and full integration flow.
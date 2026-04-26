# Auditoría de Cumplimiento - Parcial 1 (sin video)

Fecha: 2026-04-24  
Alcance evaluado: `Parcial_1.md`, `CHECKLIST.md`, `README.md`, documentación por tracks y código actual backend/frontend.  
Criterio explícito del pedido: no proponer implementaciones fuera de la rúbrica.

## Resumen Ejecutivo

Estado general: **cumplimiento parcial alto**.  
Conclusión corta: el proyecto **cumple la base técnica principal** (FastAPI + SQLModel + PostgreSQL + React + TanStack + Router), pero **no cierra al 100% la rúbrica** por pendientes puntuales de frontend de identidad/pedidos, tipado estricto y algunos detalles de forma del CRUD.

## Matriz de Cumplimiento (Rúbrica)

### 1) Arquitectura Backend (FastAPI + SQLModel + relaciones + Query/Annotated)
Estado: **Cumple**

Evidencia:
- Modelos con relaciones y pivots N:N en `app/producto/model.py`.
- Uso de `Query`, `Path`, `Annotated` en routers: `app/producto/router.py`, `app/usuario/router.py`, `app/pedido/router.py`.
- Routers integrados en `app/main.py`.

Observación:
- El track 4 en su checklist interno está sin marcar, pero en código sí hay implementación concreta de filtros/paginación/excepciones base.

### 2) Persistencia y CRUD (PostgreSQL)
Estado: **Parcial**

Evidencia:
- Conexión y engine PostgreSQL en `app/core/database.py`.
- Docker con DB + API + frontend en `docker-compose.yml`.
- CRUD implementado en usuarios, categorías, ingredientes, productos y pedidos (`app/*/router.py`).

Desvíos respecto a rúbrica:
- La rúbrica menciona códigos **201/204/404**; en varias bajas se devuelve `200` con payload en lugar de `204`.
- `delete_ingrediente` usa convención de stock=0 como “soft delete” (válido funcionalmente, pero menos claro para evaluación formal de borrado).

### 3) Seguridad de datos (Response Models, no exponer sensibles)
Estado: **Cumple**

Evidencia:
- Endpoints de usuario devuelven `UsuarioOut` sin `password_hash` en `app/usuario/router.py`.
- Auth devuelve `Token` en `app/api/routes/auth.py`.

### 4) Estructura por módulos
Estado: **Parcial**

Evidencia:
- Estructura modular por dominio (`model.py`, `schema.py`, `service.py`, `router.py`) en `app/usuario`, `app/producto`, `app/pedido`.

Desvío:
- En checklist/rúbrica se menciona `uow`; no se observa una capa UoW explícita.

### 5) Frontend React + TS + Router + TanStack
Estado: **Parcial**

Evidencia:
- Router configurado con rutas de módulos en `frontend/src/main.tsx`.
- Ruta dinámica implementada: `productos/:id` + `useParams` en `frontend/src/pages/productos/ProductoDetallePage.tsx`.
- Hooks con `useQuery`/`useMutation`/`invalidateQueries` en `frontend/src/hooks/*`.

Desvíos relevantes:
- En `frontend/src/main.tsx` hay placeholders: ruta `usuarios` y `mis-pedidos/:id` todavía en “Todo”.
- Existe `UsuariosPage.tsx` pero no está conectada a la ruta activa.

### 6) Tipado TypeScript (sin abuso de any)
Estado: **Parcial**

Evidencia:
- Hay tipado en gran parte de hooks/componentes.
- Pero hay varios `any` (usuarios, pedidos y formularios), por ejemplo en:
  - `frontend/src/hooks/useUsuarios.ts`
  - `frontend/src/pages/OrdersPage.tsx`
  - `frontend/src/components/orders/OrderList.tsx`
  - `frontend/src/components/orders/OrderDetailsModal.tsx`
  - `frontend/src/components/users/UserForm.tsx`

### 7) UI con Tailwind CSS 4, limpia y responsive
Estado: **Parcial**

Evidencia:
- Tailwind 4 activo (`frontend/src/index.css`, `frontend/vite.config.ts`).
- Muchas vistas sí usan clases utility y responsive.

Desvío:
- Hay uso intensivo de estilos inline + sectores simples sin Tailwind consistente (sobre todo en pedidos), lo que te puede bajar puntaje si evalúan “íntegramente con Tailwind”.

### 8) Integración real Frontend-Backend (sin mocks)
Estado: **Parcial**

Evidencia:
- Módulos principales consumen endpoints reales por Axios + TanStack.

Desvío:
- `UserProfilePage` usa `MOCK_USER` en lugar de datos reales.

## Qué falta implementar para cerrar la rúbrica (sin agregar alcance extra)

1. Conectar la ruta `/usuarios` a la página real `UsuariosPage` y quitar placeholder en `frontend/src/main.tsx`.
2. Completar la ruta dinámica de detalle de pedidos (`/mis-pedidos/:id`) con componente real (no `div todo`) en `frontend/src/main.tsx`.
3. Reemplazar `MOCK_USER` por consumo real de backend en `frontend/src/pages/UserProfilePage.tsx`.
4. Reducir/eliminar `any` en hooks/componentes críticos de usuarios/pedidos.
5. Ajustar códigos HTTP de borrado para alinearlos estrictamente a rúbrica (preferente `204` cuando corresponda).
6. Uniformar estilos de vistas de pedidos con Tailwind utility classes para cumplir mejor la exigencia de estilo.

## Qué NO hace falta implementar (para no salirte de rúbrica)

- No es obligatorio sumar gateways de pago reales, websockets ni inventario avanzado (ya están fuera de alcance en docs).
- No corresponde priorizar módulos no exigidos por la rúbrica central (por ejemplo, “marcas”) si tu objetivo es cerrar Parcial 1 según `Parcial_1.md`.

## Veredicto final

Si hoy te evaluaran **solo por código (sin video)**:  
- Estás en un rango de **cumplimiento funcional sólido pero incompleto**.  
- Con los pendientes listados arriba, podés cerrar la rúbrica sin meter features fuera de alcance.

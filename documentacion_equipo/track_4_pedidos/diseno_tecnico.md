# Diseño Técnico: Track 4 - Pedidos

## Backend Architecture
**Archivos a Crear/Modificar:**
- `app/models/order_model.py`: SQLAlchemy Model para Pedidos y Detalles de Pedido.
- `app/schemas/order_schema.py`: Pydantic schemas para la orden completa y sus ítems (OrderCreate, OrderResponse, OrderItemSchema).
- `app/services/order_service.py`: Reglas de negocio (cálculo de totales, reducción de stock).
- `app/routers/order_router.py`: Endpoints de FastAPI (`/orders`).

**Relaciones:**
- Pedido (1) a Detalles de Pedido (N).
- Detalle de Pedido (N) a Producto (1).

## Frontend Component Tree
**Páginas:**
- `pages/OrdersPage.tsx`: Dashboard o historial de pedidos.

**Componentes:**
- `components/orders/OrderList.tsx`: Tabla de pedidos (con filtro por estado, etc.).
- `components/orders/OrderDetailsModal.tsx`: Modal para ver los ítems del pedido.
- `components/orders/OrderCreateModal.tsx`: Modal para crear un nuevo pedido (puede requerir seleccionar productos).

**TanStack Query:**
- `useQuery` para traer la lista de pedidos (`GET /orders`). Clave: `['orders']`.
- `useMutation` para registrar nuevo pedido (`POST /orders`), actualizando el estado y llamando a `invalidateQueries(['orders'])`.
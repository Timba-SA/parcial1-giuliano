# Guía de Frontend: Track 4 - Pedidos

## React Components (React + Tailwind CSS 4)
- **Componentes Base**: `CartSidebar`, `CheckoutForm`, `OrderHistory`, `OrderStatusModal`.
- **Estructura (Tailwind)**: Interfaces modales para el carrito (`fixed inset-0 bg-black/50`, etc.). Tablas o listas de tarjetas para el historial de pedidos.

## React Router DOM
- Rutas necesarias:
  - `/carrito`: Checkout (puede ser ruta o un modal/sidebar, pero en app suele tener su paso de confirmación `<Checkout />`).
  - `/mis-pedidos`: Historial de usuario (`<OrderHistory />`).
  - `/mis-pedidos/:id`: Detalles del pedido.
  - `/admin/pedidos`: Gestión global de estado de pedidos.

## TanStack Query v5
```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Obtener mis pedidos
export const useMyOrders = () => {
    return useQuery({
        queryKey: ['orders', 'my-orders'],
        queryFn: fetchMyOrders,
    });
};

// Checkout
export const useCreateOrder = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createOrder,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['orders'] });
            queryClient.invalidateQueries({ queryKey: ['cart'] });
        },
    });
};
```

## Props e Interfaces (TypeScript)
```typescript
interface OrderItem {
    productId: number;
    quantity: number;
    price: number;
}
interface Order {
    id: number;
    total: number;
    status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
    items: OrderItem[];
    createdAt: string;
}
```
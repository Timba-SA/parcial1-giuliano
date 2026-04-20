# Guía de Frontend: Track 3 - Productos

## React Components (React + Tailwind CSS 4)
- **Componentes Base**: `ProductList`, `ProductCard`, `ProductForm`, `ProductDetailModal`.
- **Estructura (Tailwind)**: Usar un grid responsivo (`grid-cols-1 md:grid-cols-3 lg:grid-cols-4`).

## React Router DOM
- Rutas necesarias:
  - `/productos`: Catálogo principal visible al usuario.
  - `/productos/:id`: Vista de detalle.
  - `/admin/productos`: Panel de control (ABM).

## TanStack Query v5
```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export const useProducts = (filters?: { categoryId?: number, brandId?: number }) => {
    return useQuery({
        queryKey: ['products', filters],
        queryFn: () => fetchProducts(filters),
    });
};

export const useUpdateStock = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateStock,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            queryClient.invalidateQueries({ queryKey: ['product', variables.id] });
        },
    });
};
```

## Props e Interfaces (TypeScript)
```typescript
interface Product {
    id: number;
    name: string;
    description?: string;
    price: number;
    stock: number;
    categoryId?: number;
    brandId?: number;
}
```
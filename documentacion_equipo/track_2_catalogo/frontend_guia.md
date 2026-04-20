# Guía de Frontend: Track 2 - Catálogo

## React Components (React + Tailwind CSS 4)
- **Componentes Base**: `CategoryList`, `CategoryForm`, `BrandList`, `BrandForm`.
- **Estructura (Tailwind)**: Usar estilos `grid`, `gap-4` para listar. Formularios (`max-w-md`, `p-6`, `shadow-lg`, `rounded-xl`).

## React Router DOM
- Rutas necesarias:
  - `/catalogo`: Dashboard o listado principal.
  - `/categorias`: ABM de Categorías (`<CategoryList />`).
  - `/marcas`: ABM de Marcas (`<BrandList />`).

## TanStack Query v5
```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// hook para marcas:
export const useBrands = () => {
    return useQuery({
        queryKey: ['brands'],
        queryFn: fetchBrands,
    });
};

// hook para crear categoría:
export const useCreateCategory = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
        },
    });
};
```

## Props e Interfaces (TypeScript)
```typescript
interface Category {
    id: number;
    name: string;
    description?: string;
}
interface Brand {
    id: number;
    name: string;
    website?: string;
}
```
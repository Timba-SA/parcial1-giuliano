# Guía de Frontend: Track 1 - Identidad

## React Components (React + Tailwind CSS 4)
- **Componentes Base**: `LoginForm`, `UserProfile`, `UserList`.
- **Estructura (Tailwind)**: Usar componentes accesibles y con clases utilitarias (`flex`, `grid`, `text-sm`, `ring-1`, etc.).

## React Router DOM
- Rutas necesarias:
  - `/login`: Pantalla de inicio de sesión (`<LoginForm />`).
  - `/perfil`: Vista del perfil del usuario logueado (`<UserProfile />`).
  - `/usuarios`: Tabla de gestión de usuarios (solo admin) (`<UserList />`).

## TanStack Query v5
```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// hook base para listar:
export const useUsers = () => {
    return useQuery({
        queryKey: ['users'],
        queryFn: fetchUsers,
    });
};

// hook para actualizar:
export const useUpdateUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
    });
};
```

## Props e Interfaces (TypeScript)
```typescript
interface User {
    id: number;
    email: string;
    full_name: string;
    is_active: boolean;
}
interface UserFormProps {
    user?: User;
    onSubmit: (data: Partial<User>) => void;
}
```
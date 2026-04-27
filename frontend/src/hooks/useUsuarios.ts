import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const API_URL = 'http://localhost:8000';

export interface Rol {
  codigo: string;
  descripcion: string | null;
}

export interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  celular?: string;
  is_active: boolean;
  roles: Rol[];
}

export const fetchUsuarios = async (): Promise<Usuario[]> => {
  const { data } = await axios.get(`${API_URL}/usuarios/`);
  return data;
};

export const useUsuarios = () => {
  return useQuery({
    queryKey: ['usuarios'],
    queryFn: fetchUsuarios,
  });
};

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      let email: string;
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        email = payload.sub;
        if (!email) throw new Error('No email in token');
      } catch {
        throw new Error('Token inválido');
      }

      const { data } = await axios.get(`${API_URL}/usuarios/`);
      const user = data.find((u: Usuario) => u.email === email);
      if (!user) throw new Error('Usuario no encontrado');
      return user;
    },
    retry: 1
  });
};

export type NuevoUsuario = Omit<Usuario, 'id' | 'is_active' | 'roles'> & { password?: string };

export const useSignup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (nuevoUsuario: NuevoUsuario) => {
      const { data } = await axios.post(`${API_URL}/auth/signup`, nuevoUsuario);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
    },
  });
};

export const useCrearUsuario = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (nuevoUsuario: NuevoUsuario) => {
      const { data } = await axios.post(`${API_URL}/usuarios/`, nuevoUsuario);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
    },
  });
};

export const useUpdateUsuario = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<Pick<Usuario, 'nombre' | 'apellido' | 'celular' | 'is_active'>> }) => {
      const response = await axios.put(`${API_URL}/usuarios/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
    },
  });
};

export const useDeleteUsuario = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await axios.delete(`${API_URL}/usuarios/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
    },
  });
};

// ── Roles ────────────────────────────────────────────────────────────────────

export const useRoles = () => {
  return useQuery<Rol[]>({
    queryKey: ['roles'],
    queryFn: async () => {
      const { data } = await axios.get(`${API_URL}/roles/`);
      return data;
    },
  });
};

export const useAsignarRol = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, rolCodigo }: { userId: number; rolCodigo: string }) => {
      const { data } = await axios.post(`${API_URL}/usuarios/${userId}/roles`, { rol_codigo: rolCodigo });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
    },
  });
};

export const useQuitarRol = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, rolCodigo }: { userId: number; rolCodigo: string }) => {
      const { data } = await axios.delete(`${API_URL}/usuarios/${userId}/roles/${rolCodigo}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
    },
  });
};

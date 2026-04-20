import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const API_URL = 'http://localhost:8000';

export interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  celular?: string;
  is_active: boolean;
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

export const useCrearUsuario = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (nuevoUsuario: any) => {
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
    mutationFn: async ({ id, data }: { id: number; data: Partial<Usuario> }) => {
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

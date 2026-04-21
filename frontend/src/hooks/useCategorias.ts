import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const API_URL = 'http://localhost:8000/categorias';

export interface Categoria {
  id: number;
  nombre: string;
  descripcion?: string;
  orden_display: number;
  parent_id?: number | null;
  activo: boolean;
  created_at: string;
}

export interface CategoriaCreate {
  nombre: string;
  descripcion?: string;
  orden_display?: number;
  parent_id?: number | null;
  activo?: boolean;
}

export const useCategorias = () => {
  return useQuery({
    queryKey: ['categorias'],
    queryFn: async () => {
      const { data } = await axios.get<Categoria[]>(`${API_URL}/`);
      return data;
    },
  });
};

export const useCreateCategoria = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (nuevaCategoria: CategoriaCreate) => {
      const { data } = await axios.post<Categoria>(`${API_URL}/`, nuevaCategoria);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categorias'] });
    },
  });
};

export const useUpdateCategoria = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, categoria }: { id: number; categoria: Partial<CategoriaCreate> }) => {
      const { data } = await axios.put<Categoria>(`${API_URL}/${id}`, categoria);
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['categorias'] });
      queryClient.invalidateQueries({ queryKey: ['categoria', variables.id] });
    },
  });
};

export const useDeleteCategoria = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await axios.delete(`${API_URL}/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categorias'] });
    },
  });
};

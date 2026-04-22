import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { type Ingrediente } from './useProductos';

const API_URL = 'http://localhost:8000/ingredientes';

export interface IngredienteCreate {
  nombre: string;
  descripcion?: string;
  stock?: number;
  unidad_medida?: string;
}

export interface IngredienteUpdate {
  nombre?: string;
  descripcion?: string;
  stock?: number;
  unidad_medida?: string;
}

export const useIngredientes = () => {
  return useQuery({
    queryKey: ['ingredientes'],
    queryFn: async () => {
      const { data } = await axios.get<Ingrediente[]>(`${API_URL}/`);
      return data;
    }
  });
};

export const useCreateIngrediente = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (nuevoIngrediente: IngredienteCreate) => {
      const { data } = await axios.post<Ingrediente>(`${API_URL}/`, nuevoIngrediente);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ingredientes'] });
    },
  });
};

export const useDeleteIngrediente = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await axios.delete(`${API_URL}/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ingredientes'] });
    },
  });
};

export const useUpdateIngrediente = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ingrediente }: { id: number; ingrediente: IngredienteUpdate }) => {
      const { data } = await axios.put<Ingrediente>(`${API_URL}/${id}`, ingrediente);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ingredientes'] });
    },
  });
};

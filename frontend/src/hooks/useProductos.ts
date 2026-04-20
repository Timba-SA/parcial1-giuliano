import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const API_URL = 'http://localhost:8000/productos';

export interface Ingrediente {
  id: number;
  nombre: string;
  descripcion?: string;
  stock: number;
  unidad_medida: string;
}

export interface Producto {
  id: number;
  nombre: string;
  descripcion?: string;
  precio_base: number;
  tiempo_prep_min?: number;
  disponible: boolean;
  created_at: string;
  ingredientes: Ingrediente[];
}

export interface ProductoCreate {
  nombre: string;
  descripcion?: string;
  precio_base: number;
  tiempo_prep_min?: number;
  disponible?: boolean;
  categoria_ids?: number[];
  ingrediente_ids?: number[];
}

export const useProductos = (disponible?: boolean) => {
  return useQuery({
    queryKey: ['productos', disponible],
    queryFn: async () => {
      const url = disponible !== undefined 
          ? `${API_URL}/?disponible=${disponible}` 
          : `${API_URL}/`;
      const { data } = await axios.get<Producto[]>(url);
      return data;
    }
  });
};

export const useProducto = (id: number) => {
  return useQuery({
    queryKey: ['producto', id],
    queryFn: async () => {
      const { data } = await axios.get<Producto>(`${API_URL}/${id}`);
      return data;
    },
    enabled: !!id,
  });
};

export const useCreateProducto = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (nuevoProducto: ProductoCreate) => {
      const { data } = await axios.post<Producto>(`${API_URL}/`, nuevoProducto);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productos'] });
    },
  });
};

export const useUpdateProducto = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, producto }: { id: number, producto: Partial<ProductoCreate> }) => {
      const { data } = await axios.put<Producto>(`${API_URL}/${id}`, producto);
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['productos'] });
      queryClient.invalidateQueries({ queryKey: ['producto', variables.id] });
    },
  });
};

export const useUpdateStock = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, stock }: { id: number, stock: number }) => {
      const { data } = await axios.patch<Producto>(`${API_URL}/${id}/stock?stock=${stock}`);
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['productos'] });
      queryClient.invalidateQueries({ queryKey: ['producto', variables.id] });
    },
  });
};

export const useDeleteProducto = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await axios.delete(`${API_URL}/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productos'] });
    },
  });
};

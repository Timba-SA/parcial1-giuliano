import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export interface DetallePayload {
  producto_id: number;
  cantidad: number;
}

export interface CheckoutPayload {
  forma_pago_codigo: string;
  direccion_id?: number;
  detalles: DetallePayload[];
}

export const useMyOrders = (userId?: number) => {
  return useQuery({
    queryKey: ['pedidos_usuario', userId],
    queryFn: async () => {
      const url = userId ? `${API_URL}/pedidos/?user_id=${userId}` : `${API_URL}/pedidos/`;
      const { data } = await axios.get(url, { headers: getAuthHeaders() });
      return data;
    },
    enabled: true,
  });
};

export const usePedido = (pedidoId: number) => {
  return useQuery({
    queryKey: ['pedido', pedidoId],
    queryFn: async () => {
      const { data } = await axios.get(`${API_URL}/pedidos/${pedidoId}`, { headers: getAuthHeaders() });
      return data;
    },
    enabled: !!pedidoId,
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CheckoutPayload) => {
      const { data } = await axios.post(`${API_URL}/pedidos/`, payload, { headers: getAuthHeaders() });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pedidos_usuario'] });
    }
  });
};

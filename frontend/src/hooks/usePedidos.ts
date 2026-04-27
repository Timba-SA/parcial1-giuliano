import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// ── Tipos ────────────────────────────────────────────────────────────────────

export interface DetalleOut {
  producto_id: number;
  cantidad: number;
  nombre_producto_snap: string;
  precio_unitario_snap: number;
  subtotal_snap: number;
}

export interface PedidoOut {
  id: number;
  subtotal: number;
  descuento: number;
  costo_envio: number;
  total: number;
  estado_codigo: string;
  detalles: DetalleOut[];
  created_at: string | null;
  updated_at: string | null;
}

export interface DetallePayload {
  producto_id: number;
  cantidad: number;
}

export interface CheckoutPayload {
  forma_pago_codigo: string;
  direccion_id?: number;
  detalles: DetallePayload[];
}

// ── Hooks ────────────────────────────────────────────────────────────────────

export const useMyOrders = (userId?: number) => {
  return useQuery<PedidoOut[]>({
    queryKey: ['pedidos_usuario', userId],
    queryFn: async () => {
      const url = userId
        ? `${API_URL}/pedidos/?user_id=${userId}`
        : `${API_URL}/pedidos/`;
      const { data } = await axios.get<PedidoOut[]>(url, { headers: getAuthHeaders() });
      return data;
    },
    enabled: true,
  });
};

export const usePedido = (pedidoId: number) => {
  return useQuery<PedidoOut>({
    queryKey: ['pedido', pedidoId],
    queryFn: async () => {
      const { data } = await axios.get<PedidoOut>(
        `${API_URL}/pedidos/${pedidoId}`,
        { headers: getAuthHeaders() }
      );
      return data;
    },
    enabled: !!pedidoId,
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation<PedidoOut, Error, CheckoutPayload>({
    mutationFn: async (payload: CheckoutPayload) => {
      const { data } = await axios.post<PedidoOut>(
        `${API_URL}/pedidos/`,
        payload,
        { headers: getAuthHeaders() }
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pedidos_usuario'] });
    },
  });
};

export const useUpdateOrderState = () => {
  const queryClient = useQueryClient();
  return useMutation<PedidoOut, Error, { id: number; nuevo_estado: string }>({
    mutationFn: async ({ id, nuevo_estado }) => {
      const { data } = await axios.patch<PedidoOut>(
        `${API_URL}/pedidos/${id}/estado?nuevo_estado=${nuevo_estado}`,
        {},
        { headers: getAuthHeaders() }
      );
      return data;
    },
    onSuccess: (_, variables) => {
      // Invalidar el pedido individual y la lista general
      queryClient.invalidateQueries({ queryKey: ['pedido', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['pedidos_usuario'] });
    },
  });
};

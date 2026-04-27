import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCreateOrder } from '../hooks/usePedidos';
import { useProductos, type Producto } from '../hooks/useProductos';

interface LineItem {
  producto_id: number;
  cantidad: number;
}

const CarritoPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: productos = [], isLoading } = useProductos();
  const createOrder = useCreateOrder();

  const [items, setItems] = useState<LineItem[]>([
    { producto_id: 0, cantidad: 1 },
  ]);
  const [formaPago, setFormaPago] = useState('efectivo');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Inicializar con el primer producto disponible cuando cargan
  React.useEffect(() => {
    if (productos.length > 0 && items[0].producto_id === 0) {
      setItems([{ producto_id: productos[0].id, cantidad: 1 }]);
    }
  }, [productos]);

  const total = useMemo(() => {
    return items.reduce((sum, item) => {
      const p = productos.find((x: Producto) => x.id === item.producto_id);
      return sum + (p ? p.precio_base * item.cantidad : 0);
    }, 0);
  }, [items, productos]);

  const updateItem = (idx: number, key: keyof LineItem, value: number) => {
    const copy = [...items];
    copy[idx] = { ...copy[idx], [key]: value };
    setItems(copy);
  };

  const addItem = () => {
    const first = productos[0];
    if (first) setItems([...items, { producto_id: first.id, cantidad: 1 }]);
  };

  const removeItem = (idx: number) => {
    if (items.length === 1) return; // mínimo 1 item
    setItems(items.filter((_, i) => i !== idx));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const invalid = items.filter((i) => !i.producto_id || i.cantidad < 1);
    if (invalid.length > 0) {
      setError('Revisá los items: todos deben tener un producto y cantidad ≥ 1');
      return;
    }

    createOrder.mutate(
      { forma_pago_codigo: formaPago, detalles: items },
      {
        onSuccess: () => {
          setSuccess(true);
          setTimeout(() => navigate('/mis-pedidos'), 1500);
        },
        onError: (err: unknown) => {
          if (axios.isAxiosError<{ detail: string }>(err)) {
            setError(err.response?.data?.detail ?? 'Error creando el pedido');
          } else {
            setError('Error creando el pedido');
          }
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-gray-400 text-sm">Cargando productos...</div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="max-w-md mx-auto text-center py-24 space-y-4">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
          <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900">¡Pedido creado!</h2>
        <p className="text-sm text-gray-500">Redirigiendo a Mis pedidos...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Nuevo pedido</h1>
        <p className="mt-1 text-sm text-gray-500">
          Seleccioná los productos y confirmá tu pedido.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        {/* Forma de pago */}
        <div className="bg-white rounded-xl shadow ring-1 ring-gray-200 p-5">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
            Forma de pago
          </label>
          <select
            value={formaPago}
            onChange={(e) => setFormaPago(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="efectivo">💵 Efectivo</option>
            <option value="tarjeta">💳 Tarjeta</option>
          </select>
        </div>

        {/* Items */}
        <div className="bg-white rounded-xl shadow ring-1 ring-gray-200 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
              Productos
            </label>
            <button
              type="button"
              onClick={addItem}
              className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              Agregar
            </button>
          </div>

          {items.map((item, idx) => {
            const prod = productos.find((p: Producto) => p.id === item.producto_id);
            return (
              <div key={idx} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                {/* Selector producto */}
                <select
                  value={item.producto_id}
                  onChange={(e) => updateItem(idx, 'producto_id', parseInt(e.target.value))}
                  className="flex-1 px-2 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {productos.map((p: Producto) => (
                    <option key={p.id} value={p.id}>
                      {p.nombre}
                    </option>
                  ))}
                </select>

                {/* Precio unitario */}
                <span className="text-xs text-gray-400 w-16 text-right shrink-0">
                  ${prod ? prod.precio_base.toFixed(2) : '0.00'} c/u
                </span>

                {/* Cantidad */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => updateItem(idx, 'cantidad', Math.max(1, item.cantidad - 1))}
                    className="w-6 h-6 rounded-md bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-xs font-bold transition-colors"
                  >−</button>
                  <span className="w-6 text-center text-sm font-semibold">{item.cantidad}</span>
                  <button
                    type="button"
                    onClick={() => updateItem(idx, 'cantidad', item.cantidad + 1)}
                    className="w-6 h-6 rounded-md bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-xs font-bold transition-colors"
                  >+</button>
                </div>

                {/* Subtotal */}
                <span className="text-sm font-semibold text-gray-900 w-16 text-right shrink-0">
                  ${prod ? (prod.precio_base * item.cantidad).toFixed(2) : '0.00'}
                </span>

                {/* Eliminar */}
                {items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItem(idx)}
                    className="text-red-400 hover:text-red-600 transition-colors shrink-0"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Resumen */}
        <div className="bg-white rounded-xl shadow ring-1 ring-gray-200 p-5">
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-gray-600">Total estimado</span>
            <span className="text-2xl font-black text-indigo-700">${total.toFixed(2)}</span>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={createOrder.isPending || items.length === 0}
          className="w-full py-3 px-4 rounded-xl text-sm font-bold text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            boxShadow: '0 4px 20px rgba(99,102,241,0.4)',
          }}
        >
          {createOrder.isPending ? 'Confirmando...' : 'Confirmar pedido'}
        </button>
      </form>
    </div>
  );
};

export default CarritoPage;

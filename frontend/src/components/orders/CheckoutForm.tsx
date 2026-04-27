import React, { useState, useMemo } from 'react';
import axios from 'axios';
import { useCreateOrder } from '../../hooks/usePedidos';
import { useProductos, type Producto } from '../../hooks/useProductos';

const CheckoutForm: React.FC = () => {
  const { data: productos = [] } = useProductos();
  const [items, setItems] = useState<{ producto_id: number; cantidad: number }[]>([{ producto_id: productos?.[0]?.id || 0, cantidad: 1 }]);
  const [formaPago, setFormaPago] = useState('efectivo');
  const [message, setMessage] = useState<string | null>(null);
  const createOrder = useCreateOrder();

  const total = useMemo(() => {
    let s = 0;
    for (const it of items) {
      const p = productos.find((x: Producto) => x.id === it.producto_id);
      const price = p ? p.precio_base || 0 : 0;
      s += price * (it.cantidad || 0);
    }
    return s;
  }, [items, productos]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
      createOrder.mutate({ forma_pago_codigo: formaPago, detalles: items }, {
        onSuccess: () => {
          setMessage('Pedido creado correctamente');
        setItems([{ producto_id: productos?.[0]?.id || 0, cantidad: 1 }]);
      },
      onError: (err: unknown) => {
        if (axios.isAxiosError<{ detail: string }>(err)) {
          setMessage(err.response?.data?.detail ?? 'Error creando pedido');
        } else {
          setMessage('Error creando pedido');
        }
      }
    });
  };

  const updateItem = (idx: number, key: 'producto_id' | 'cantidad', value: number) => {
    const copy = [...items];
    copy[idx] = { ...copy[idx], [key]: value };
    setItems(copy);
  };

  const addItem = () => setItems([...items, { producto_id: productos?.[0]?.id || 0, cantidad: 1 }]);
  const removeItem = (idx: number) => setItems(items.filter((_, i) => i !== idx));

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {message && <div className="text-sm text-green-700">{message}</div>}
      <div>
        <label className="block text-sm font-medium">Forma de pago</label>
        <select value={formaPago} onChange={(e) => setFormaPago(e.target.value)} className="mt-1 p-2 border rounded">
          <option value="efectivo">Efectivo</option>
          <option value="tarjeta">Tarjeta</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium">Items</label>
        <div className="space-y-2 mt-2">
          {items.map((it, idx) => (
            <div key={idx} className="flex gap-2 items-center">
              <select value={it.producto_id} onChange={(e) => updateItem(idx, 'producto_id', parseInt(e.target.value || '0'))} className="p-2 border rounded">
                {productos.map((p: Producto) => (
                  <option key={p.id} value={p.id}>{p.nombre} - ${p.precio_base}</option>
                ))}
              </select>
              <input type="number" min={1} value={it.cantidad} onChange={(e) => updateItem(idx, 'cantidad', parseInt(e.target.value || '1'))} className="w-24 p-2 border rounded" />
              <button type="button" onClick={() => removeItem(idx)} className="text-red-600">Eliminar</button>
            </div>
          ))}
        </div>
        <div className="mt-2">
          <button type="button" onClick={addItem} className="px-2 py-1 bg-gray-100 rounded">Agregar item</button>
        </div>
      </div>

      <div>
        <div className="font-semibold">Total estimado: ${total.toFixed(2)}</div>
      </div>

      <div>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Confirmar pedido</button>
      </div>
    </form>
  );
};

export default CheckoutForm;

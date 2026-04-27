import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { usePedido, useUpdateOrderState, type DetalleOut } from '../hooks/usePedidos';
import { useAuth } from '../context/AuthContext';

const estadoBadge = (estado: string) => {
  const styles: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    paid: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };
  const labels: Record<string, string> = {
    pending: 'Pendiente',
    paid: 'Pagado',
    shipped: 'Enviado',
    delivered: 'Entregado',
    cancelled: 'Cancelado',
  };
  return (
    <span
      className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase ${
        styles[estado] ?? 'bg-gray-100 text-gray-700'
      }`}
    >
      {labels[estado] ?? estado}
    </span>
  );
};

const OrderDetallePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: pedido, isLoading, error } = usePedido(Number(id));
  const { role } = useAuth();
  const updateState = useUpdateOrderState();

  const handleStateChange = (nuevoEstado: string) => {
    if (!id) return;
    updateState.mutate({ id: Number(id), nuevo_estado: nuevoEstado });
  };

  if (isLoading)
    return (
      <div className="p-8 text-center text-gray-500">
        Cargando detalle del pedido...
      </div>
    );
  if (error || !pedido)
    return (
      <div className="p-8 text-center text-red-500">
        Error cargando el pedido o no encontrado.
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          Pedido <span className="text-indigo-600">#{pedido.id}</span>
        </h1>
        <Link
          to="/mis-pedidos"
          className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
        >
          ← Volver a mis pedidos
        </Link>
      </div>

      {/* Resumen */}
      <div className="bg-white rounded-xl shadow ring-1 ring-gray-200 p-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Estado</p>
          <div className="mt-1">{estadoBadge(pedido.estado_codigo)}</div>
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Subtotal</p>
          <p className="mt-1 text-sm font-semibold text-gray-900">
            ${pedido.subtotal.toFixed(2)}
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Envío</p>
          <p className="mt-1 text-sm font-semibold text-gray-900">
            ${pedido.costo_envio.toFixed(2)}
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</p>
          <p className="mt-1 text-lg font-black text-indigo-700">
            ${pedido.total.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Admin Controls */}
      {(role === 'admin' || role === 'empleado') && (
        <div className="bg-indigo-50 rounded-xl p-4 ring-1 ring-indigo-200">
          <p className="text-xs font-bold text-indigo-800 uppercase tracking-wider mb-3">
            Gestión (Admin / Empleado)
          </p>
          <div className="flex flex-wrap gap-2">
            {pedido.estado_codigo === 'pending' && (
              <button
                onClick={() => handleStateChange('paid')}
                disabled={updateState.isPending}
                className="px-3 py-1.5 text-xs font-bold text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
              >
                Cobrar (Paid)
              </button>
            )}
            {pedido.estado_codigo === 'paid' && (
              <button
                onClick={() => handleStateChange('shipped')}
                disabled={updateState.isPending}
                className="px-3 py-1.5 text-xs font-bold text-white bg-purple-500 hover:bg-purple-600 rounded-lg transition-colors"
              >
                Despachar (Shipped)
              </button>
            )}
            {pedido.estado_codigo === 'shipped' && (
              <button
                onClick={() => handleStateChange('delivered')}
                disabled={updateState.isPending}
                className="px-3 py-1.5 text-xs font-bold text-white bg-green-500 hover:bg-green-600 rounded-lg transition-colors"
              >
                Marcar Entregado
              </button>
            )}
            {pedido.estado_codigo !== 'delivered' && pedido.estado_codigo !== 'cancelled' && (
              <button
                onClick={() => handleStateChange('cancelled')}
                disabled={updateState.isPending}
                className="px-3 py-1.5 text-xs font-bold text-red-600 bg-red-100 hover:bg-red-200 rounded-lg transition-colors ml-auto"
              >
                Cancelar pedido
              </button>
            )}
            {pedido.estado_codigo === 'delivered' && (
              <span className="text-xs font-semibold text-green-700">El pedido fue entregado y está cerrado.</span>
            )}
            {pedido.estado_codigo === 'cancelled' && (
              <span className="text-xs font-semibold text-red-700">El pedido está cancelado.</span>
            )}
          </div>
        </div>
      )}

      {/* Detalle de productos */}
      <div className="bg-white rounded-xl shadow ring-1 ring-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-sm font-bold text-gray-800">Productos del pedido</h2>
        </div>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Producto
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Precio unit.
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cantidad
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Subtotal
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 text-sm">
            {pedido.detalles.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-gray-400">
                  Sin productos
                </td>
              </tr>
            ) : (
              pedido.detalles.map((det: DetalleOut, idx: number) => (
                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {det.nombre_producto_snap}
                  </td>
                  <td className="px-6 py-4 text-right text-gray-600">
                    ${det.precio_unitario_snap.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-right text-gray-600">
                    {det.cantidad}
                  </td>
                  <td className="px-6 py-4 text-right font-semibold text-gray-900">
                    ${det.subtotal_snap.toFixed(2)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderDetallePage;
import React from 'react';
import { Link } from 'react-router-dom';
import { useMyOrders } from '../hooks/usePedidos';
import OrderList from '../components/orders/OrderList';

const estadoBadge = (estado: string) => {
  const styles: Record<string, string> = {
    pending:   'bg-yellow-100 text-yellow-800',
    paid:      'bg-blue-100 text-blue-800',
    shipped:   'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };
  return styles[estado] ?? 'bg-gray-100 text-gray-700';
};

const OrdersPage: React.FC = () => {
  const { data: pedidos = [], isLoading, error } = useMyOrders();

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mis pedidos</h1>
          <p className="mt-1 text-sm text-gray-500">
            Historial de todos tus pedidos realizados.
          </p>
        </div>
        <Link
          to="/carrito"
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white transition-all"
          style={{
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            boxShadow: '0 4px 16px rgba(99,102,241,0.35)',
          }}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          Nuevo pedido
        </Link>
      </div>

      {/* Contenido */}
      {isLoading ? (
        <div className="bg-white rounded-xl shadow ring-1 ring-gray-200 p-8 text-center text-sm text-gray-400">
          Cargando pedidos...
        </div>
      ) : error ? (
        <div className="bg-white rounded-xl shadow ring-1 ring-gray-200 p-8 text-center text-sm text-red-500">
          Error cargando pedidos.
        </div>
      ) : pedidos.length === 0 ? (
        <div className="bg-white rounded-xl shadow ring-1 ring-gray-200 p-12 text-center space-y-3">
          <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mx-auto">
            <svg className="w-7 h-7 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <p className="text-sm font-semibold text-gray-600">Todavía no tenés pedidos</p>
          <p className="text-xs text-gray-400">Explorá el catálogo y hacé tu primer pedido.</p>
          <Link
            to="/carrito"
            className="inline-block mt-2 px-4 py-2 rounded-lg text-xs font-bold text-indigo-600 border border-indigo-200 hover:bg-indigo-50 transition-colors"
          >
            Ir al carrito
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow ring-1 ring-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <span className="text-sm font-bold text-gray-800">
              {pedidos.length} pedido{pedidos.length !== 1 ? 's' : ''}
            </span>
          </div>
          <OrderList pedidos={pedidos} />
        </div>
      )}
    </div>
  );
};

export default OrdersPage;

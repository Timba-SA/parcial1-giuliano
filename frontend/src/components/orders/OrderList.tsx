import React from 'react';
import { Link } from 'react-router-dom';

export interface PedidoSummary {
  id: number;
  total: number;
  estado_codigo: string;
}

interface Props {
  pedidos: PedidoSummary[];
  onSelect?: (id: number) => void;
}

const OrderList: React.FC<Props> = ({ pedidos, onSelect }) => {
  if (!pedidos || pedidos.length === 0) return <div className="p-4 text-gray-500">No hay pedidos</div>;

  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {pedidos.map(p => (
          <tr key={p.id}>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{p.id}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${p.total?.toFixed(2) || '0.00'}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{p.estado_codigo}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <Link to={`/mis-pedidos/${p.id}`} className="text-indigo-600 hover:text-indigo-900">Ver Detalles</Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default OrderList;

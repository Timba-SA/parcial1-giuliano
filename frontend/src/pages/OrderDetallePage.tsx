import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { usePedido } from '../hooks/usePedidos';

const OrderDetallePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: pedido, isLoading, error } = usePedido(Number(id));

  if (isLoading) return <div className="p-4 text-gray-500">Cargando detalle del pedido...</div>;
  if (error || !pedido) return <div className="p-4 text-red-500">Error cargando el pedido o no encontrado</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Detalle del Pedido #{pedido.id}</h2>
        <Link to="/mis-pedidos" className="text-blue-600 hover:text-blue-800">Volver a mis pedidos</Link>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <p className="text-gray-700 mb-2"><strong>Estado:</strong> <span className="uppercase">{pedido.estado}</span></p>
        <p className="text-gray-700 mb-2"><strong>Total:</strong> ${pedido.total?.toFixed(2)}</p>
      </div>

      <h3 className="text-xl font-semibold mb-4 text-gray-800">Productos</h3>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio Unitario</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {pedido.detalles?.map((det: { id: number; producto_id: number; cantidad: number; precio_unitario: number }) => (
              <tr key={det.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{det.producto_id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{det.cantidad}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${det.precio_unitario?.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderDetallePage;
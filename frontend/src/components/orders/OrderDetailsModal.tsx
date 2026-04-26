import React from 'react';

interface Props {
  pedido: {
    id: number;
    estado_codigo: string;
    total: number;
    detalles?: { id: number; producto_id: number; cantidad: number }[];
  } | null;
  onClose: () => void;
}

const OrderDetailsModal: React.FC<Props> = ({ pedido, onClose }) => {
  if (!pedido) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-900">Detalle del Pedido #{pedido.id}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <span className="sr-only">Cerrar</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="space-y-3 mb-6">
          <p className="text-gray-700"><span className="font-semibold">Estado:</span> <span className="uppercase">{pedido.estado_codigo}</span></p>
          <p className="text-gray-700"><span className="font-semibold">Total:</span> ${pedido.total?.toFixed(2) || '0.00'}</p>
        </div>

        <h4 className="text-lg font-semibold text-gray-900 mb-3">Detalles</h4>
        <div className="bg-gray-50 rounded-md p-4 mb-6 max-h-48 overflow-y-auto">
          <ul className="space-y-2">
            {pedido.detalles?.map((det) => (
              <li key={det.id} className="text-sm text-gray-700 border-b border-gray-200 pb-2 last:border-0 last:pb-0">
                Producto ID: {det.producto_id} <span className="mx-2 text-gray-400">|</span> Cantidad: {det.cantidad}
              </li>
            ))}
            {!pedido.detalles?.length && (
              <li className="text-sm text-gray-500 italic">No hay detalles disponibles</li>
            )}
          </ul>
        </div>
        
        <div className="mt-5 sm:mt-6">
          <button 
            onClick={onClose}
            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;

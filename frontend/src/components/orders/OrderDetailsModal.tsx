import React from 'react';

interface Props {
  pedido: any | null;
  onClose: () => void;
}

const OrderDetailsModal: React.FC<Props> = ({ pedido, onClose }) => {
  if (!pedido) return null;
  return (
    <div style={{ position: 'fixed', left: 0, right: 0, top: 0, bottom: 0, background: 'rgba(0,0,0,0.3)' }}>
      <div style={{ background: '#fff', margin: '5% auto', padding: 20, width: 600 }}>
        <h3>Pedido #{pedido.id}</h3>
        <p>Total: {pedido.total}</p>
        <p>Estado: {pedido.estado_codigo}</p>
        <button onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
};

export default OrderDetailsModal;

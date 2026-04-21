import React from 'react';
import { PedidoOut } from '../../types';

interface Props {
  pedidos: any[];
  onSelect?: (id: number) => void;
}

const OrderList: React.FC<Props> = ({ pedidos, onSelect }) => {
  if (!pedidos) return <div>No hay pedidos</div>;

  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Total</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {pedidos.map(p => (
          <tr key={p.id}>
            <td>{p.id}</td>
            <td>{p.total}</td>
            <td>{p.estado_codigo}</td>
            <td>
              <button onClick={() => onSelect && onSelect(p.id)}>Ver</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default OrderList;

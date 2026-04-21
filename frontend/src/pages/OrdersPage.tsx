import React, { useState } from 'react';
import { useMyOrders } from '../hooks/usePedidos';
import OrderList from '../components/orders/OrderList';
import OrderDetailsModal from '../components/orders/OrderDetailsModal';
import CheckoutForm from '../components/orders/CheckoutForm';

const OrdersPage: React.FC = () => {
  const { data, isLoading, error } = useMyOrders();
  const [selected, setSelected] = useState<number | null>(null);

  if (isLoading) return <div>Cargando pedidos...</div>;
  if (error) return <div>Error cargando pedidos</div>;

  const pedido = data?.find((p: any) => p.id === selected) || null;

  return (
    <div>
      <h2>Mis Pedidos</h2>
      <section className="mb-6">
        <h3>Checkout rápido</h3>
        <CheckoutForm />
      </section>
      <OrderList pedidos={data || []} onSelect={(id) => setSelected(id)} />
      <OrderDetailsModal pedido={pedido} onClose={() => setSelected(null)} />
    </div>
  );
};

export default OrdersPage;

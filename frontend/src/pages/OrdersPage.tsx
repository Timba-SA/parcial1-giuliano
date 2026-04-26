import React from 'react';
import { useMyOrders } from '../hooks/usePedidos';
import OrderList from '../components/orders/OrderList';
import CheckoutForm from '../components/orders/CheckoutForm';

const OrdersPage: React.FC = () => {
  const { data, isLoading, error } = useMyOrders();

  if (isLoading) return <div className="p-4">Cargando pedidos...</div>;
  if (error) return <div className="p-4 text-red-500">Error cargando pedidos</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Mis Pedidos</h2>
      <section className="mb-8 p-4 bg-white rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4">Checkout rápido</h3>
        <CheckoutForm />
      </section>
      <section className="bg-white rounded-lg shadow overflow-hidden">
        <OrderList pedidos={data || []} />
      </section>
    </div>
  );
};

export default OrdersPage;

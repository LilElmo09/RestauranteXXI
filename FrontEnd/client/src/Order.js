import React, { useContext } from 'react';
import { OrderContext } from './OrderContext';

const Order = () => {
  const { order } = useContext(OrderContext);

  return (
    <div className="order">
      <h2>Tu Pedido</h2>
      <ul>
        {order.map((dish, index) => (
          <li key={index}>{dish.name} - ${dish.price}</li>
        ))}
      </ul>
      <p>Total: ${order.reduce((acc, dish) => acc + dish.price, 0)}</p>
    </div>
  );
};

export default Order;


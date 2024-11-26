import React, { createContext, useState } from 'react';

export const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [order, setOrder] = useState([]);

  const addToOrder = (dish) => {
    setOrder([...order, dish]);
  };

  return (
    <OrderContext.Provider value={{ order, addToOrder }}>
      {children}
    </OrderContext.Provider>
  );
};

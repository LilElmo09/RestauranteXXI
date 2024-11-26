import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { OrderContext } from './OrderContext';

const Menu = () => {
  const { addToOrder } = useContext(OrderContext);
  const [dishes, setDishes] = useState([]);

  useEffect(() => {
    const fetchDishes = async () => {
      try {
        const response = await axios.get('/api/dishes');
        setDishes(response.data);
      } catch (error) {
        console.error('Error al obtener los platos:', error);
      }
    };
    fetchDishes();
  }, []);

  return (
    <div className="menu">
      <h2>Menú</h2>
      <ul>
        {dishes.map(dish => (
          <li key={dish.id}>
            {dish.name} - ${dish.price}
            <button onClick={() => addToOrder(dish)}>Agregar al Pedido</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Menu;


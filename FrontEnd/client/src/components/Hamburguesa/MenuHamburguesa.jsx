import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUserShield,   // Administrador
  faMoneyBillWave, // Finanzas
  faUtensils,     // Cocina
  faWarehouse,    // Bodega
  faUser          // Cliente
} from '@fortawesome/free-solid-svg-icons';
import './MenuHamburguesa.css';

const MenuHamburguesa = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleCloseMenu = () => {
    setIsOpen(false);
  };

  const handleClickOutside = (event) => {
    if (
      menuRef.current &&
      !menuRef.current.contains(event.target) &&
      buttonRef.current &&
      !buttonRef.current.contains(event.target)
    ) {
      handleCloseMenu();
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const selectedRole = localStorage.getItem('selectedRole');
  if (!selectedRole) return null;

  const getRoleIcon = (role) => {
    switch (role) {
      case 'administrador':
        return { 
          icon: faUserShield, 
          color: '#DAA520', // Dorado real
          shadow: '0 0 12px rgba(218, 165, 32, 0.8)' // Sombra dorada brillante
        };
      case 'finanzas':
        return { 
          icon: faMoneyBillWave, 
          color: '#E9C46A', 
          shadow: '0 0 10px rgba(233, 196, 106, 0.6)' 
        };
      case 'cocina':
        return { 
          icon: faUtensils, 
          color: '#F4A261', 
          shadow: '0 0 10px rgba(244, 162, 97, 0.6)' 
        };
      case 'bodega':
        return { 
          icon: faWarehouse, 
          color: '#264653', 
          shadow: '0 0 10px rgba(38, 70, 83, 0.6)' 
        };
      case 'cliente':
        return { 
          icon: faUser, 
          color: '#E76F51', 
          shadow: '0 0 10px rgba(231, 111, 81, 0.6)' 
        };
      default:
        return { 
          icon: faUser, 
          color: '#333', 
          shadow: '0 0 10px rgba(51, 51, 51, 0.6)' 
        };
    }
  };
  

  const { icon, color, shadow } = getRoleIcon(selectedRole);

  const handleMenuItemClick = (path) => {
    navigate(path);
    handleCloseMenu();
  };

  return (
    <div>
      <div
        className={`hamburguesa ${isOpen ? 'active' : ''}`}
        onClick={toggleMenu}
        ref={buttonRef}
      >
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
      </div>

      {isOpen && (
        <div className="menu" ref={menuRef}>
          <ul>
            <h3 className='rol-menu' style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <FontAwesomeIcon 
                icon={icon} 
                style={{ 
                  fontSize: '1.8rem', 
                  color, 
                  boxShadow: shadow 
                }}
              />
              {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1).toLowerCase()}
            </h3>

            <li onClick={() => handleMenuItemClick('/')}>Inicio</li>
            {selectedRole === 'administrador' && (
              <>
                <li onClick={() => handleMenuItemClick('/dashboard-admin')}>Dashboard</li>
                <li onClick={() => handleMenuItemClick('/gestion-usuarios')}>Gestión de usuarios</li>
                <li onClick={() => handleMenuItemClick('/gestion-productos')}>Gestión de productos</li>
                <li onClick={() => handleMenuItemClick('/gestion-mesas')}>Gestión de mesas</li>
                <li onClick={() => handleMenuItemClick('/soporte-admin')}>Ticket</li>
              </>
            )}
            {selectedRole === 'cliente' && (
              <>
                <li onClick={() => handleMenuItemClick('/dashboard-cliente')}>Dashboard</li>
                <li onClick={() => handleMenuItemClick('/pedidos')}>Mis pedidos</li>
                <li onClick={() => handleMenuItemClick('/soporte')}>Soporte</li>
              </>
            )}
            {selectedRole === 'cocina' && (
              <>
                <li onClick={() => handleMenuItemClick('/dashboard-cocina')}>Dashboard</li>
                <li onClick={() => handleMenuItemClick('/comandas')}>Comandas</li>
                <li onClick={() => handleMenuItemClick('/cocina')}>Cocina</li>
              </>
            )}
            {selectedRole === 'bodega' && (
              <>
                <li onClick={() => handleMenuItemClick('/dashboard-bodega')}>Dashboard</li>
                <li onClick={() => handleMenuItemClick('/stock')}>Stock</li>
                <li onClick={() => handleMenuItemClick('/recetas')}>Recetas</li>
                <li onClick={() => handleMenuItemClick('/proveedor-bodega')}>Proveedores</li>
              </>
            )}
            {selectedRole === 'finanzas' && (
              <>
                <li onClick={() => handleMenuItemClick('/dashboard-finanzas')}>Dashboard</li>
                <li onClick={() => handleMenuItemClick('/caja')}>Caja</li>
                <li onClick={() => handleMenuItemClick('/utilidades')}>Utilidades</li>
              </>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MenuHamburguesa;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Importa useNavigate
import "./SeleccionarRol.css";

const RoleSelection = ({ onRoleSelect }) => {
  const id = localStorage.getItem("id");
  const navigate = useNavigate(); // Inicializa el hook useNavigate
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const roleIcons = {
    administrador: 'fas fa-user-shield',
    cliente: 'fas fa-user',
    cocina: 'fas fa-utensils',
    finanzas: 'fas fa-hand-holding-usd',
    bodega: 'fas fa-boxes',
  };


  // // Mapeo de roles a clases de colores específicas
  // const roleClasses = {
  //   administrador: 'admin-button',
  //   cliente: 'client-button',
  //   cocina: 'kitchen-button',
  //   finanzas: 'finance-button',
  //   bodega: 'warehouse-button',
  // };

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        console.log("ID desde localStorage:", id);
        const response = await fetch(`http://localhost:3000/user-roles/${id}`);
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        const data = await response.json();
        console.log("Datos de roles:", data);
        setRoles(data.map((roleObj) => roleObj.rol));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchRoles();
    }
  }, [id]);

  if (loading) {
    return <p>Cargando roles...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!roles.length) {
    return <p>No hay roles disponibles para seleccionar.</p>;
  }

  const handleRoleSelect = (role) => {
    // Verifica si onRoleSelect es una función antes de llamarla
    if (typeof onRoleSelect === "function") {
      onRoleSelect(role);
    } else {
      console.error("onRoleSelect no es una función");
    }

    // Guarda el rol seleccionado en localStorage
    localStorage.setItem("selectedRole", role);

    // Redirecciona según el rol seleccionado
    switch (role) {
      case "administrador":
        navigate("/dashboard-admin"); // Redirige a la página del administrador
        break;
      case "cliente":
        navigate("/dashboard-cliente"); // Redirige a la página del cliente
        break;
      case "cocina":
        navigate("/cocina"); // Redirige a la página de la cocina
        break;
        case "finanzas":          
          navigate("/finanzas"); 
          break;
          case "bodega":          
          navigate("/bodega"); 
          break;
      default:
        console.error("Rol no reconocido:", role);
    }
  };

  return (
    <div className="margen">
    <h2>Selecciona un rol</h2>
    <ul>
      {roles.map((role) => (
        <li key={role}>
          <button onClick={() => handleRoleSelect(role)} className="especialidad-card">
            <i className={roleIcons[role] || 'fas fa-user-circle'}></i>
            {role.charAt(0).toUpperCase() + role.slice(1)}
          </button>
        </li>
      ))}
    </ul>
  </div>
  );
};

export default RoleSelection;

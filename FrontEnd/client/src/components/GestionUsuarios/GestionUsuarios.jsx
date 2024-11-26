import React, { useState, useEffect, useRef } from "react";
import "./GestionUsuarios.css";
import Swal from 'sweetalert2';
import axios from 'axios';

const UserTable = ({ onDelete, onInfo, onUpdate, deletingUserId, updatingUserId }) => {
  const [users, setUsers] = useState([]);
  const [activeMenu, setActiveMenu] = useState(null);
  const [dropdownVisible, setDropdownVisible] = useState(null);
  const [allRoles, setAllRoles] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loadingRoles, setLoadingRoles] = useState(true);

  const menuRef = useRef(null);
  const dropdownRef = useRef(null); 

  useEffect(() => {
    fetch("http://localhost:3000/get-users")
      .then((response) => response.json())
      .then((data) => {
        const groupedUsers = data.reduce((acc, user) => {
          const existingUser = acc.find((u) => u.id === user.id);
          const role = { id: user.role_id, nombre: user.rol || "" };
  
          if (existingUser) {
            existingUser.roles.push(role);
          } else {
            acc.push({ ...user, roles: [role] });
          }
          return acc;
        }, []);
        setUsers(groupedUsers);
      })
      .catch((error) => console.error("Error fetching users:", error));
  
    fetch("http://localhost:3000/get-roles")
      .then((response) => response.json())
      .then((roles) => setAllRoles(roles))
      .catch((error) => console.error("Error fetching roles:", error));
  }, []);  // Solo se ejecuta una vez al montar el componente

  

    // Función para cambiar solo el estado de un usuario, no para actualizarlo
  const toggleUserStatus = async (userId, currentStatus) => {
    try {
      const response = await fetch(`http://localhost:3000/update-user/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ activo: !currentStatus }),
      });
      if (response.ok) {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === userId ? { ...user, activo: !currentStatus } : user
          )
        );
      } else {
        console.error("Error al actualizar el usuario");
      }
    } catch (error) {
      console.error("Error en la petición:", error);
    }
  };

  const handleToggleMenu = (userId) => {
    setActiveMenu((prev) => (prev === userId ? null : userId));
  };

  const toggleDropdown = (userId) => {
    setDropdownVisible((prev) => (prev === userId ? null : userId));
  };
  const handleOptionClick = (action) => {

    setActiveMenu(null); // Cierra el menú
    action();
  };
  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setActiveMenu(null);
    }
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownVisible(null);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleDeleteRole = async (userId, roleId) => {
    const user = users.find((u) => u.id === userId);

    if (user.roles.length === 1) {
      console.warn("No se puede eliminar el último rol asignado.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/delete-barge/${userId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rol_id: roleId }),
      });

      if (response.ok) {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === userId
              ? { ...user, roles: user.roles.filter((r) => r.id !== roleId) }
              : user
          )
        );
      } else {
        console.error("Error al eliminar el rol");
      }
    } catch (error) {
      console.error("Error en la petición:", error);
    }
  };

  const handleAddRole = async (userId, roleId) => {
    try {
      const response = await fetch(`http://localhost:3000/add-role/${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rol_id: roleId }),
      });

      if (response.ok) {
        const addedRole = allRoles.find(
          (role) => role.id === roleId && role.nombre
        );
        if (addedRole) {
          setUsers((prevUsers) =>
            prevUsers.map((user) =>
              user.id === userId
                ? { ...user, roles: [...user.roles, addedRole] }
                : user
            )
          );
          setDropdownVisible(null);
        }
      } else {
        console.error("Error al agregar el rol");
      }
    } catch (error) {
      console.error("Error en la petición:", error);
    }
  };

  // Maneja la eliminación de usuarios
useEffect(() => {
  if (deletingUserId !== null) {
    console.log(`Animando la eliminación del usuario con ID: ${deletingUserId}`);
    const timeoutId = setTimeout(() => {
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== deletingUserId));
      console.log(`Usuario con ID: ${deletingUserId} ha sido eliminado de la lista.`);
    }, 1000); // Tiempo para completar la animación

    return () => clearTimeout(timeoutId);
  }
}, [deletingUserId]);

// Actualiza el usuario tras confirmación de cambios

useEffect(() => {
  const fetchAllUsers = async () => {
    try {
      const response = await fetch("http://localhost:3000/get-users");
      const data = await response.json();
      const groupedUsers = data.reduce((acc, user) => {
        const existingUser = acc.find((u) => u.id === user.id);
        const role = { id: user.role_id, nombre: user.rol || "" };

        if (existingUser) {
          existingUser.roles.push(role);
        } else {
          acc.push({ ...user, roles: [role] });
        }
        return acc;
      }, []);
      setUsers(groupedUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  fetchAllUsers();
}, [updatingUserId]);  // Dependiendo de la actualización del usuario, obtén los usuarios de nuevo


  
  // Obtener roles desde la API
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axios.get('http://localhost:3000/get-roles');
        setRoles(response.data);
      } catch (error) {
        console.error('Error al obtener los roles:', error);
      } finally {
        setLoadingRoles(false); // Finalizar la carga
      }
    };
    fetchRoles();
  }, []);

  // Manejo del evento de crear cuenta
  const handleCrearCuenta = () => {
    // Si los roles están en proceso de carga, mostramos un mensaje de espera
    if (loadingRoles) {
      Swal.fire({
        title: 'Cargando roles...',
        text: 'Espera un momento mientras cargamos los roles disponibles.',
        icon: 'info',
        showConfirmButton: false,
        allowOutsideClick: false,
      });
      return;
    }
  
    Swal.fire({
      title: '<strong>Crear cuenta</strong>',
      html: `
        <form id="register-form">
          <div class="swal-input-container">
            <input id="nombre" class="swal-input" placeholder="Nombre" required />
            <input id="apellido" class="swal-input" placeholder="Apellido" required />
            <input id="email" class="swal-input" type="email" placeholder="Correo electrónico" required />
            <input id="contraseña" class="swal-input" type="password" placeholder="Contraseña" required />
            <label for="activo" class="swal-label">Estado activo</label>
            <select id="activo" class="swal-select">
              <option value="true">Activo</option>
              <option value="false">Inactivo</option>
            </select>
            <label for="rol" class="swal-label">Rol</label>
            <select id="rol" class="swal-select">
              ${roles.map((role) => `<option value="${role.id}">${role.nombre}</option>`).join('')}
            </select>
          </div>
        </form>
      `,
      focusConfirm: false,
      preConfirm: () => {
        const nombre = document.getElementById('nombre').value;
        const apellido = document.getElementById('apellido').value;
        const email = document.getElementById('email').value;
        const contraseña = document.getElementById('contraseña').value;
        const activo = document.getElementById('activo').value;
        const rol_id = document.getElementById('rol').value;
  
        return { nombre, apellido, email, contraseña, activo, rol_id };
      },
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Crear cuenta',
      cancelButtonColor: '#d33',
      confirmButtonColor: '#4CAF50',
      scrollbarPadding: false,
      customClass: {
        popup: 'swal-popup-custom',
        confirmButton: 'swal-confirm-btn',
        cancelButton: 'swal-cancel-btn',
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.post('http://localhost:3000/admin/register', result.value);
  
          if (response.status === 201) {
            Swal.fire({
              icon: 'success',
              title: '<strong style="color:#302f2f;">¡Cuenta creada, ya puede iniciar sesión!</strong>',
              html: '<p style="color:#333; font-size:1.1em; margin-top:10px;">La acción se realizó correctamente.</p>',
              showConfirmButton: true,
              confirmButtonText: 'Aceptar',
              confirmButtonColor: '#4caf50',
              background: '#f4f6f9',
              timer: 3000,
              timerProgressBar: true,
              scrollPadding: false,
              customClass: {
                popup: 'my-custom-swal-popup',
                title: 'my-custom-swal-title',
                htmlContainer: 'my-custom-swal-html',
              },
            });
  
            // Vuelve a cargar los usuarios desde la API
            fetch("http://localhost:3000/get-users")
              .then((response) => response.json())
              .then((data) => {
                const groupedUsers = data.reduce((acc, user) => {
                  const existingUser = acc.find((u) => u.id === user.id);
                  const role = { id: user.role_id, nombre: user.rol || "" };
  
                  if (existingUser) {
                    existingUser.roles.push(role);
                  } else {
                    acc.push({ ...user, roles: [role] });
                  }
                  return acc;
                }, []);
                setUsers(groupedUsers);
              })
              .catch((error) => console.error("Error fetching users:", error));
          }
  
        } catch (error) {
          if (error.response && error.response.data.message.includes('usuarios_email_key')) {
            Swal.fire({
              text: 'El correo ya se encuentra registrado.',
              icon: 'warning',
              toast: true,
              position: 'top',
              timer: 4000,
              timerProgressBar: true,
              showCloseButton: false,
              showConfirmButton: false,
            });
          } else {
            Swal.fire('Error', 'Hubo un problema al crear la cuenta. Inténtalo de nuevo', 'error');
          }
        }
      }
    });
  
  
  }    
  return (
    <div className="container-list-users">
      <h1>Gestión de usuarios</h1>
      <button onClick={handleCrearCuenta} className="crear-cuenta-btn">
      <i className="fas fa-plus"></i>
      <span>Crear cuenta</span>

    </button>
    {users.map((user) => (
        <div
        key={user.id}
  className={`user-card ${deletingUserId === user.id ? "fade-out" : ""} ${
    updatingUserId === user.id ? "updating" : ""
  }`}
      >
      
          <div className="header-box">
            <p>
              <i className="fas fa-user-circle"></i> {user.nombre} {user.apellido}
            </p>
            <div className="options-container">
              <i
                className="fa-solid fa-ellipsis-vertical options-icon"
                onClick={() => handleToggleMenu(user.id)}
              ></i>
              {activeMenu === user.id && (
                <div className="options-menu" ref={menuRef}>
                  <div className="container-info">
                    <i
                      className="fa-solid fa-circle-info info"
                      onClick={() => handleOptionClick(() => onInfo(user.id))}
                    ></i>
                    <button onClick={() => handleOptionClick(() => onInfo(user.id))}>Información</button>
                  </div>
                  <div className="container-info">
                    <i
                      className="fa-solid fa-user-pen info"
                      onClick={() => handleOptionClick(() => onUpdate(user.id))}
                    ></i>
                    <button onClick={() => handleOptionClick(() => onUpdate(user.id))}>Modificar</button>
                  </div>
                  <div className="container-info">
                    <i
                      className="fa-solid fa-user-xmark info"
                      onClick={() => handleOptionClick(() => onDelete(user.id))}
                    ></i>
                    <button className="eliminar" onClick={() => handleOptionClick(() => onDelete(user.id))}>Eliminar</button>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="body-box">
            <div className="names-email">
              <p className="correo">{user.email}</p>
              <div className="activo-switch">
                <p className="enable">Habilitar/Deshabilitar cuenta</p>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={user.activo}
                    onChange={() => toggleUserStatus(user.id, user.activo)}
                  />
                  <span className="slider"></span>
                </label>
              </div>
            </div>
          </div>
          <hr />
          <div className="footer-box">
            <div className="roles">
              {user.roles.map((role, index) => (
                <span key={`${user.id}-${role.id}-${index}`} className="role-badge">
                  {role.nombre}
                  {user.roles.length > 1 && (
                    <button
                      className="delete-role-button"
                      onClick={() => handleDeleteRole(user.id, role.id)}
                    >
                      &times;
                    </button>
                  )}
                </span>
              ))}
              {allRoles.some((role) => !user.roles.some((r) => r.id === role.id)) && (
                <span
                  className="role-badge add-role-badge"
                  onClick={() => toggleDropdown(user.id)}
                >
                  +
                </span>
              )}
              {dropdownVisible === user.id && (
                <div className="role-dropdown" ref={dropdownRef}>
                  {allRoles
                    .filter((role) => !user.roles.some((r) => r.id === role.id))
                    .map((role) => (
                      <div
                        key={`${user.id}-${role.id}-dropdown`}
                        className="role-dropdown-item"
                        onClick={() => handleAddRole(user.id, role.id)}
                      >
                        <span className="role-icon">👤</span>
                        <span className="role-name">{role.nombre}</span>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserTable;

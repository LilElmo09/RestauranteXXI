// App.js
import "./App.css";
import axios from "axios";
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  useLocation,
  Navigate,
} from "react-router-dom";
import { useState, useEffect } from "react";
import SeleccionarRol from "./components/SeleccionarRol/SeleccionarRol";
import Header from "./components/Header/Header";
import Home from "./components/Home/Home";
import Registro from "./components/Registro/Registro";
import Login from "./components/Login/Login";
import Footer from "./components/Footer/Footer";
import MenuHamburguesa from "./components/Hamburguesa/MenuHamburguesa";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import DashboardAdmin from "./components/Admin/DashboardAdmin";
import DashboardCliente from "./components/DashboardCliente/DashboardCliente";
import GestionUsuarios from "./components/GestionUsuarios/GestionUsuarios";
import Swal from "sweetalert2";
import Soporte from "./components/Soporte/Soporte";
import SoporteAdmin from "./components/SoporteAdmin/SoporteAdmin";
import Menu from "./components/Menu/Menu";
import Finanzas from "./components/Finanzas/Finanzas";
import Utilidades from "./components/Utilidades/Utilidades";

function AppContent() {
  const [allRoles, setAllRoles] = useState([]);

  const [users, setUsers] = useState([]); // Agregar el estado de usuarios
  const [updatingUserId, setUpdatingUserId] = useState(null);
  const [updatedUser, setUpdatedUser] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const [deletingUserId, setDeletingUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(() => {
    const roles = JSON.parse(localStorage.getItem("roles"));
    const nombre = localStorage.getItem("nombre");
    const token = localStorage.getItem("token");
    const apellido = localStorage.getItem("apellido");
    const selectedRole = localStorage.getItem("selectedRole");

    const autoSelectedRole =
      selectedRole || (roles && roles.length === 1 ? roles[0] : null);

    return roles && token && apellido && nombre
      ? { roles, nombre, apellido, token, selectedRole: autoSelectedRole }
      : null;
  });






  const fetchUsers = () => {
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
  };

  useEffect(() => {
    fetchUsers();
    fetch("http://localhost:3000/get-roles")
      .then((response) => response.json())
      .then((roles) => setAllRoles(roles))
      .catch((error) => console.error("Error fetching roles:", error));
  }, []);






  const navigate = useNavigate();
  const location = useLocation();

  const login = (roles, nombre, token, apellido, email) => {
    const selectedRole = roles.length === 1 ? roles[0] : null;
    setUser({ roles, nombre, token, selectedRole, apellido, email });
    localStorage.setItem("roles", JSON.stringify(roles));
    localStorage.setItem("nombre", nombre);
    localStorage.setItem("token", token);
    localStorage.setItem("apellido", apellido);
    localStorage.setItem("email", email);
    if (selectedRole) {
      localStorage.setItem("selectedRole", selectedRole);
    }
  };

  const handleRoleSelect = (role) => {
    setUser((prevUser) => ({ ...prevUser, selectedRole: role }));
    localStorage.setItem("selectedRole", role);

    switch (role) {
      case "administrador":
        navigate("/dashboard-admin");
        break;
      case "cliente":
        navigate("/dashboard-cliente");
        break;
      default:
        console.error("Rol no reconocido:", role);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("roles");
    localStorage.removeItem("selectedRole");
    localStorage.removeItem("nombre");
    localStorage.removeItem("apellido");
    localStorage.removeItem("email");
    setUser(null);
  };

  // Este efecto se ejecuta al cargar el componente
  useEffect(() => {
    // Si estamos en la página de selección de rol, asegurémonos de que el rol esté vacío
    if (location.pathname === "/role-selection") {
      setUser((prevUser) => ({ ...prevUser, selectedRole: null })); // Limpiar el rol seleccionado
    } else if (!user?.selectedRole) {
      // Si no hay rol seleccionado y no estamos en la página de selección de rol
      localStorage.removeItem("selectedRole"); // Limpia el rol de localStorage
    }
  }, [location.pathname, user?.selectedRole]); // Monitorea cambios en la ubicación y el estado del usuario

  // Definir las funciones para GestionUsuarios
  const handleDelete = (userId) => {
    setDeletingUserId(null);
    Swal.fire({
      title: '<span style="color:#d32f2f;">¿Estás seguro?</span>',
      html: "<p style='color:#4a4a4a; font-size:16px;'>Esta acción eliminará todos los registros relacionados con este usuario y no podrá deshacerse.</p>",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: '<span style="color:white;">Sí, eliminar</span>',
      cancelButtonText: "<span>Cancelar</span>",
      reverseButtons: true,
      buttonsStyling: false,
      scrollbarPadding: false,
      customClass: {
        popup: "swal-popup-custom",
        confirmButton: "swal-cancel-btn-2",
        cancelButton: "swal-cancel-btn",
      },
      backdrop: `

      `,
      background: "#fefefe",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setDeletingUserId(userId); // Establecer el ID para activar la animación
        try {
          setLoading(true);
          const response = await fetch(
            `http://localhost:3000/delete-user/${userId}`,
            {
              method: "DELETE",
            }
          );
          if (!response.ok) {
            throw new Error("Hubo un problema al eliminar el usuario");
          }

          const data = await response.json();
          Swal.fire({
            title: '<strong style="color:#2d8e4f;">¡Éxito!</strong>',
            html: `<p style="color:#333; font-size:1.1em; margin-top:10px;">El usuario ha sido eliminado correctamente.</p>`,
            icon: "success",
            confirmButtonText: "Aceptar",
            scrollbarPadding: false,
            customClass: {
              confirmButton: "swal-confirm-btn",
              popup: "swal-popup-custom",
              title: "swal-title-custom",
              htmlContainer: "swal-html-custom",
            },
          });


          // Esperar a que termine la animación y luego eliminar el usuario de la lista
          setTimeout(() => {
            setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
            setDeletingUserId(null); // Resetear el ID para quitar la animación
          }, 2000); // 500 ms es el tiempo de la animación de desvanecimiento
          if (response.ok) {
            setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));  // Elimina el usuario de la lista
          } else {
            console.error("Error al eliminar el usuario");
          }
        } catch (error) {
          Swal.fire({
            title: "Error",
            text: "Hubo un problema al eliminar el usuario. Por favor, inténtalo de nuevo más tarde.",
            icon: "error",
            confirmButtonText: "Aceptar",
            scrollbarPadding: false,
            customClass: {
              confirmButton: "swal-confirm-btn",
            },
          });
          setDeletingUserId(null);
        } finally {
          setLoading(false);
        }
      } else {
        Swal.fire({
          title: "Cancelado",
          text: "El usuario no ha sido eliminado.",
          icon: "info",
          confirmButtonText: "Aceptar",
          scrollbarPadding: false,
          customClass: {
            confirmButton: "swal-confirm-btn",
          },
        });
      }
    });
  };

  // Función para manejar la visualización de la información del usuario
  const handleInfo = async (userId) => {
    try {
      // Llamada a la API para obtener la información del usuario
      const response = await fetch(`http://localhost:3000/get-user/${userId}`);
      const user = await response.json();

      // Formatear las fechas de creación y actualización
      const fechaCreacion = formatDate(user.creado_en);
      const fechaActualizacion = formatDate(user.actualizado_en);

      // SweetAlert con diseño visual atractivo
      Swal.fire({
        title: `<span style="color: #4a90e2;">Información de ${user.nombre} ${user.apellido}</span>`,
        html: `
        <div style="text-align: left; font-size: 16px; color: #555;">
          <p><strong>Nombre:</strong> ${user.nombre} ${user.apellido}</p>
          <p><strong>Email:</strong> ${user.email}</p>
          <p><strong>Estado:</strong> ${user.activo ? "Activo" : "Inactivo"}</p>
          <p><strong>Cuenta creada:</strong> ${fechaCreacion}</p>
          <p><strong>Última actualización:</strong> ${fechaActualizacion}</p>
        </div>
      `,
        showCloseButton: true,
        confirmButtonText: '<span style="color:white;">Cerrar</span>',
        buttonsStyling: false,

        customClass: {
          popup: "swal-popup-info",
          confirmButton: "swal-confirm-btn",
        },
        width: 400,
        background: "#f7f8fa",
        scrollbarPadding: false,
        backdrop: `
                rgba(0,0,123,0.4)
        url("https://sweetalert2.github.io/images/nyan-cat.gif")
        left top
        no-repeat
      `,
      });
    } catch (error) {
      console.error("Error al obtener la información del usuario:", error);
      Swal.fire({
        title: "Error",
        scrollbarPadding: false,
        text: "No se pudo cargar la información del usuario. Inténtalo de nuevo más tarde.",
        icon: "error",
      });
    }
  };





  // Función de actualización para modificar `users`
  const handleUpdate = async (userId) => {
    setIsUpdating(true); // Rehabilitar el botón al terminar el proceso
    setUpdatingUserId(userId);

    try {
      const response = await fetch(`http://localhost:3000/get-user/${userId}`);
      const currentUser = await response.json();
      const loggedEmail = localStorage.getItem('email');

      const result = await Swal.fire({
        title: '<strong>Actualizar usuario</strong>',
        html: `
        <form id="update-form">
          <div class="swal-input-container">
            <input id="nombre" class="swal-input" placeholder="Nombre" value="${currentUser.nombre}" required />
            <input id="apellido" class="swal-input" placeholder="Apellido" value="${currentUser.apellido}" required />
            <input id="nuevaContraseña" class="swal-input" type="password" placeholder="Nueva contraseña" />
          </div>
        </form>
      `,
        preConfirm: () => {
          const nombre = document.getElementById('nombre').value;
          const apellido = document.getElementById('apellido').value;
          const nuevaContraseña = document.getElementById('nuevaContraseña').value;
          return { nombre, apellido, nuevaContraseña };
        },
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Modificar',
        confirmButtonColor: '#4CAF50',
        scrollbarPadding: false,
      });

      if (result.isConfirmed) {
        const { nombre, apellido, nuevaContraseña } = result.value;

        const finalPassword = nuevaContraseña ? nuevaContraseña : currentUser.contraseña;

        const adminAuth = await Swal.fire({
          title: 'Confirmación de administrador',
          html: `
          <form id="auth-form">
            <div class="swal-input-container">
              <input id="adminEmail" class="swal-input" type="email" placeholder="Correo de administrador" required />
              <input id="adminPassword" class="swal-input" type="password" placeholder="Contraseña de administrador" required />
            </div>
          </form>
        `,
          preConfirm: () => {
            const adminEmail = document.getElementById('adminEmail').value;
            const adminPassword = document.getElementById('adminPassword').value;
            return { adminEmail, adminPassword };
          },
          showCancelButton: true,
          confirmButtonText: 'Confirmar',
        });
        console.log("Admin Auth:", adminAuth);

        if (adminAuth.isConfirmed) {
          const { adminEmail, adminPassword } = adminAuth.value;

          if (adminEmail === loggedEmail) {
            try {
              const loginResponse = await axios.post("http://localhost:3000/login", {
                email: adminEmail,
                contraseña: adminPassword,
              });
              console.log("Login Response:", loginResponse.data);

              // Crear el objeto de datos de actualización sin incluir `contraseña` si `nuevaContraseña` está vacío


              if (nombre && apellido && finalPassword) {

                const updateResponse = await axios.put(`http://localhost:3000/update-user-admin/${userId}`, {
                  nombre,
                  apellido,
                  contraseña: finalPassword,  // Usamos la contraseña final (actual si no hay nueva)
                });
                const updateData = { nombre, apellido };
                if (finalPassword) {
                  updateData.contraseña = finalPassword;
                }
                if (updateResponse.status === 200) {
                  console.log("Usuario actualizado:", updateResponse.data);
                  setUsers(prevUsers =>
                    prevUsers.map(user =>
                      user.id === userId ? { ...user, nombre, apellido } : user
                    )
                  );
                  setUpdatingUserId(null);


                  // Mostrar mensaje de éxito
                  Swal.fire({
                    icon: 'success',
                    title: '¡Actualización exitosa!',
                    toast: true,
                    position: 'top',
                    timer: 2000,
                    timerProgressBar: true,
                    showCloseButton: false,
                    showConfirmButton: false,
                  });
                }
              } else {
                throw new Error("No tienes permisos de administrador.");
              }
            } catch (error) {
              Swal.fire({
                icon: 'error',
                title: 'Verifica tus credenciales o permisos.',
                toast: true,
                position: 'top',
                timer: 2000,
                timerProgressBar: true,
                showCloseButton: false,
                showConfirmButton: false,
              });
            }
          } else {
            Swal.fire({
              icon: 'error',
              title: 'El email ingresado no corresponde al usuario autenticado.',
              toast: true,
              position: 'top',
              timer: 2000,
              timerProgressBar: true,
              showCloseButton: false,
              showConfirmButton: false,
            });
          }
        }
      }
    } catch (error) {
      console.error("Error al obtener información del usuario:", error);
      Swal.fire({
        icon: 'error',
        title: 'No se pudo obtener la información del usuario.',
        toast: true,
        position: 'top',
        timer: 2000,
        timerProgressBar: true,
        showCloseButton: false,
        showConfirmButton: false,

      });
    } finally {
      setUpdatingUserId(null);
    }
  };











  return (
    <>
      <Header
        user={user}
        onLogout={handleLogout}
        selectedRole={user?.selectedRole}
      />

      {user && user.selectedRole && location.pathname !== "/role-selection" && (
        <MenuHamburguesa roles={[user.selectedRole]} />
      )}

      <main>
        <Routes>
          <Route path="/" element={<Menu />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/ingresar" element={<Login onLogin={login} />} />

          <Route path="/role-selection" element={<PrivateRoute user={user}><SeleccionarRol onRoleSelect={handleRoleSelect} /></PrivateRoute>} />

          {/* Opciones de administrador */}
          <Route path="/dashboard-admin" element={<PrivateRoute user={user} allowedRoles={["administrador"]}><DashboardAdmin /></PrivateRoute>} />
          <Route path="/soporte-admin" element={<PrivateRoute user={user} allowedRoles={["administrador"]}><SoporteAdmin /></PrivateRoute>} />
          <Route path="/gestion-usuarios" element={<PrivateRoute user={user} allowedRoles={["administrador"]}><GestionUsuarios
            onDelete={handleDelete}
            onInfo={handleInfo}
            onUpdate={handleUpdate}
            deletingUserId={deletingUserId}
            updatingUserId={updatingUserId} // Pasamos updatingUserId al componente hijo
            allRoles={allRoles}
            onFetchUsers={fetchUsers}
            users={users} /></PrivateRoute>} />

          {/* Opciones de cliente */}
          <Route path="/dashboard-cliente" element={<PrivateRoute user={user} allowedRoles={["cliente"]}><DashboardCliente /></PrivateRoute>} />
          <Route path="/soporte" element={<PrivateRoute user={user} allowedRoles={["cliente"]}><Soporte /></PrivateRoute>} />

          {/* Finanzas */}
          <Route path="/finanzas" element={<PrivateRoute user={user} allowedRoles={["finanzas"]}><Finanzas /></PrivateRoute>} />
          <Route path="/utilidades" element={<PrivateRoute user={user} allowedRoles={["finanzas"]}><Utilidades /></PrivateRoute>} />


        </Routes>
      </main>
      <Footer />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;

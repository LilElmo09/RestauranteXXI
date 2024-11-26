import "./Header.css";
import logo from "../../images/logo2.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Header({ user, onLogout, selectedRole  }) {
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isRoleSelected, setIsRoleSelected] = useState(!!selectedRole);
  const navigate = useNavigate();
  const apellido = localStorage.getItem('apellido');
  const email = localStorage.getItem('email');

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleDropdownClick = (event) => {
    event.stopPropagation(); // Evita que el click se propague al documento
    toggleDropdown();
  };

  const handleLogout = () => {
    onLogout();
    navigate('/'); // Redirige al inicio
  };

  const isAuthenticated = !!user?.token;

  // Este efecto se ejecuta al cargar el componente y en cada cambio de ruta
  useEffect(() => {
    // Verifica si el rol está seleccionado en `localStorage`
    const selectedRole = localStorage.getItem("selectedRole");
    // Aquí ajustamos la lógica para manejar el estado correctamente
    if (location.pathname === "/role-selection") {
      // Si estamos en la selección de rol, no debería mostrarse "Cambiar de rol"
      setIsRoleSelected(false);
    } else {
      // En otras rutas, se muestra si hay un rol seleccionado
      setIsRoleSelected(!!selectedRole);
    }
  }, [location.pathname]);


  useEffect(() => {
    // Actualiza `isRoleSelected` cada vez que `selectedRole` cambie
    setIsRoleSelected(!!selectedRole);
  }, [selectedRole, location.pathname]);

  
  const handleRoleSelection = () => {
    // Simulación de la selección del rol
    const selectedRole = "nuevoRol"; // Simulación del valor de rol
    localStorage.setItem("selectedRole", selectedRole);
    setIsRoleSelected(true); // Fuerza el renderizado inmediato
    setDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownOpen && !event.target.closest(".user-info")) {
        setDropdownOpen(false); // Cierra el dropdown si se hace clic fuera
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
    <div className="container-header">
      <div className="container-logo">
        <img src={logo} alt="Logo del restaurante" />
        <div className="container-title">
          <h1>Restaurante</h1>
          <small>Siglo XXI</small>
        </div>
      </div>

      <div className="container-menu">
        <ul>
          <Link
            to="/"
            className={`inicio ${location.pathname === "/" ? "active" : ""}`}
          >
            Inicio
          </Link>

          {isAuthenticated ? (
            <div
              className={`user-info ${dropdownOpen ? "open" : ""}`}
              onClick={handleDropdownClick}
            >
              <span className="user-greeting">Hola, {user.nombre} <span className="dropdown-arrow">▼</span></span>
              {dropdownOpen && (
                <div className="dropdown-menu">
                  <div className="container-profile">
                    <div className="profile"><p>{user.nombre.charAt(0)}</p></div>
                    <div className="name-lastname">
                      <p>{user.nombre} {apellido}</p>
                      <small>{email}</small>
                    </div>
                  </div>
                  <hr />
                  <div className="container-options">
                    <Link className="dd" to="/profile" onClick={() => setDropdownOpen(false)}><i className="fa-solid fa-user icon-profile"></i> Perfil</Link>
                    <Link 
                      className="dd" 
                      to="/role-selection" 
                      onClick={() => { handleRoleSelection(); }}
                    ><i className="fa-solid icon-profile fa-users"></i> 
                      {isRoleSelected ? " Cambiar de rol" : " Seleccionar rol"}
                    </Link>
                    <Link className="dd" onClick={() => { handleLogout(); setDropdownOpen(false); }}><i className="fa-solid fa-right-from-bracket"></i> Cerrar Sesión</Link>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                to="/registro"
                className={`inicio ${location.pathname === "/registro" ? "active" : ""}`}
              >
                Crear Cuenta
              </Link>
              <Link
                to="/ingresar"
                className={`ingresar ${location.pathname === "/ingresar" ? "active" : ""}`}
              >
                Ingresar
              </Link>
            </>
          )}
        </ul>
      </div>
    </div>
  );
}

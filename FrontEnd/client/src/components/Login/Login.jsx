import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Login.css';

export default function Login({ onLogin }) { // Recibe la función onLogin
  const [formData, setFormData] = useState({
    email: '',
    contraseña: '',
  });
  
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

// Login.js
const handleSubmit = async (e) => {
  e.preventDefault();
  setErrors({});

  const newErrors = {};
  if (!formData.email) {
    newErrors.email = 'El email es obligatorio.';
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    newErrors.email = 'El formato de email no es válido.';
  }
  if (!formData.contraseña) newErrors.contraseña = 'La contraseña es obligatoria.';

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al iniciar sesión.');
    }

    const data = await response.json(); console.log(data);
    localStorage.setItem('token', data.token);
    localStorage.setItem('nombre', data.nombre);
    localStorage.setItem('apellido', data.apellido);
    localStorage.setItem('email', data.email);
    console.log('PROBANDO'+ data.email);
    localStorage.setItem('id', data.id);
    const roles = Array.isArray(data.roles) ? data.roles : [];
    localStorage.setItem('roles', JSON.stringify(roles));

    onLogin(roles, data.nombre, data.token, data.apellido, data.email);

    if (roles.length > 1) {
      // Redirige al componente de selección de rol si el usuario tiene múltiples roles
      navigate('/role-selection', { state: { userId: data.id } });
    } else if (roles.includes('administrador')) {
      navigate('/dashboard-admin');
    } else if (roles.includes('cliente')) {
      navigate('/dashboard-cliente');
    } else {
      navigate('/');
    }

    Swal.fire({
      text: 'Inicio de sesión exitoso',
      icon: 'success',
      toast: true,
      position: 'top',
      timer: 1200,
      timerProgressBar: true,
      showCloseButton: false,
      showConfirmButton: false,
    });

    setFormData({ email: '', contraseña: '' });
  } catch (error) {
    setErrors({ ...errors, general: error.message });
    Swal.fire({
      text: error.message,
      icon: 'error',
      toast: true,
      position: 'top',
      timer: 4000,
      timerProgressBar: true,
      showCloseButton: false,
      showConfirmButton: false,
    });
  }
};

  return (
    <div className="login-container">
      <h2>Inicio de Sesión</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
          />
        </div>

        <div className="form-group">
          <label htmlFor="contraseña">Contraseña:</label>
          <input
            type="password"
            id="contraseña"
            name="contraseña"
            value={formData.contraseña}
            onChange={handleChange}
            className={`form-control ${errors.contraseña ? 'is-invalid' : ''}`}
          />
          {errors.contraseña && <div className="invalid-feedback">{errors.contraseña}</div>}
        </div>

        <button type="submit" className="btn btn-primary mt-3">Iniciar Sesión</button>
      </form>
    </div>
  );
}

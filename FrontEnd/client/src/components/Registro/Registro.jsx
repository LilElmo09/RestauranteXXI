import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Registro.css';

export default function Registro() {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const newErrors = {};
    if (!formData.nombre) newErrors.nombre = 'El nombre es obligatorio.';
    if (!formData.apellido) newErrors.apellido = 'El apellido es obligatorio.';
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
      const response = await fetch('http://localhost:3000/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.message.includes('llave duplicada viola restricción de unicidad «usuarios_email_key»')) {
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
          throw new Error('Error al registrar el usuario.');
        }
        return;
      }

      const data = await response.json();
      console.log('Usuario registrado:', data);

      // Mostrar el toast de éxito y redirigir después de que se cierre
      Swal.fire({
        text: 'Usuario registrado correctamente',
        icon: 'success',
        toast: true,
        position: 'top',
        timer: 2000,
        timerProgressBar: true,
        showCloseButton: false,
        showConfirmButton: false,
      }).then(() => {
        navigate('/ingresar');
      });

      setFormData({
        nombre: '',
        apellido: '',
        email: '',
        contraseña: '',
      });

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
    <div className="registro-container">
      <h2>Registro</h2>
      {/* {errors.general && <p className="text-danger">{errors.general}</p>} */}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="nombre">Nombre:</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
          />
          {errors.nombre && <div className="invalid-feedback">{errors.nombre}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="apellido">Apellido:</label>
          <input
            type="text"
            id="apellido"
            name="apellido"
            value={formData.apellido}
            onChange={handleChange}
            className={`form-control ${errors.apellido ? 'is-invalid' : ''}`}
          />
          {errors.apellido && <div className="invalid-feedback">{errors.apellido}</div>}
        </div>

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
          {errors.email && <div className="invalid-feedback">{errors.email}</div>}
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

        <button type="submit" className="btn btn-primary mt-3">Registrar</button>
      </form>
    </div>
  );
}

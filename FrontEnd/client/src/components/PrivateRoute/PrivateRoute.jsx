// components/PrivateRoute/PrivateRoute.js
import { Navigate } from 'react-router-dom';

function PrivateRoute({ user, allowedRoles, children }) {
  // Verifica si el usuario está autenticado
  if (!user) {
    return <Navigate to="/ingresar" replace />;
  }
  // Verifica si el usuario tiene el rol permitido (si se especifica allowedRoles)
  if (allowedRoles && !allowedRoles.includes(user.selectedRole)) {
    return <Navigate to="/" replace />;
  }
  // Renderiza el contenido protegido si el usuario está autenticado y tiene el rol permitido
  return children;
}

export default PrivateRoute;

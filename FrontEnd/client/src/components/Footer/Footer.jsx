import "./Footer.css";
import logo2 from "../../images/logo2white.png";

export default function Footer() {
  return (
    <div className="container-footer">
      <div className="container-list">
        <ul>
          <h2>Nosotros</h2>
          <li>Quiénes sómos</li>
          <li>Cómo llegar</li>
          <li>Reservas</li>
        </ul>

        <ul>
          <h2>Informacion</h2>
          <li>Terminos</li>
          <li>Privacidad</li>
          <li>Política de cookies</li>
        </ul>

        <ul>
          <h2>Nuestras redes</h2>
          <div className="container-icons">
            <i className="fa-brands fa-facebook-f"></i>
            <i className="fa-brands fa-instagram"></i>
            <i className="fa-brands fa-twitter"></i>
            <i className="fa-brands fa-linkedin-in"></i>
            <i className="fa-brands fa-discord"></i>
            <i className="fa-brands fa-github"></i>
          </div>
        </ul>
      </div>
      <div className="down-line">
        <img className="logo-footer" src={logo2} alt="" srcSet="" />
        <p>&copy; {new Date().getFullYear()} Restaurante Siglo XXI</p>
      </div>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import "./DashboardCliente.css";
import UserCountChart from "../../components/Grafico/Grafico";
import axios from "axios";
import CountUp from "react-countup";
import GraficoIncidencias from "../../components/Grafico/GraficoIncidencias"; // Importa el nuevo gráfico
import GraficoGeneral from "../../components/Grafico/GraficoGeneral"; // Importa el nuevo gráfico

export default function DashboardAdmin() {
  const [userStats, setUserStats] = useState({
    total: 0,
    activos: 0,
    inactivos: 0,
  });

  const [issueStats, setIssueStats] = useState({
    total: 0,
    pendientes: 0,
    en_proceso: 0,
    resueltos: 0,
  });

  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const response = await axios.get("http://localhost:3000/count-users");
        setUserStats(response.data);
      } catch (error) {
        console.error("Error al obtener los datos de usuarios: ", error);
      }
    };

    const fetchIssueCount = async () => {
      try {
        const response = await axios.get("http://localhost:3000/count-issues");
        setIssueStats(response.data);
      } catch (error) {
        console.error("Error al obtener los datos de incidencias: ", error);
      }
    };

    fetchUserCount();
    fetchIssueCount();
  }, []);

  return (
    <div className="container-admin">
      <div className="admin">
        <h1>Dashboard cliente</h1>
        <div className="admin-menu">
          {/* Productos */}
          <div className="admin-menu-item b">
            <i className="fas fa-utensils bb"></i>
            <div className="admin-menu-content">
              <h2>Mis productos</h2>
              <small>Mis pedidos</small>
              <p>
                <CountUp start={0} end={80} duration={2} />
              </p>
            </div>
          </div>

          {/* Incidencias Totales */}
          <div className="admin-menu-item e">
            <i className="fa-solid fa-exclamation-triangle ee"></i>
            <div className="admin-menu-content">
              <h2>Incidencias</h2>
              <small>Soporte</small>
              <p>
                <CountUp start={0} end={issueStats.total} duration={2} />
              </p>
            </div>
          </div>

          {/* Incidencias Resueltas */}
          <div className="admin-menu-item f">
            <i className="fa-solid fa-check-circle ff"></i>
            <div className="admin-menu-content">
              <h2>Resueltos</h2>
              <small>Soporte</small>
              <p>
                <CountUp start={0} end={issueStats.resueltos} duration={2} />
              </p>
            </div>
          </div>

          {/* Incidencias Pendientes */}
          <div className="admin-menu-item g">
            <i className="fa-solid fa-hourglass-half gg"></i>
            <div className="admin-menu-content">
              <h2>En Espera</h2>
              <small>Soporte</small>
              <p>
                <CountUp start={0} end={issueStats.pendientes} duration={2} />
              </p>
            </div>
          </div>

          {/* Incidencias En Proceso */}
          <div className="admin-menu-item h">
            <i className="fa-solid fa-spinner hh"></i>
            <div className="admin-menu-content">
              <h2>En Curso</h2>
              <small>Soporte</small>
              <p>
                <CountUp start={0} end={issueStats.en_proceso} duration={2} />
              </p>
            </div>
          </div>
        </div>
        <div className="container-grafics">
          <div className="Product-inProgress">
            esto recibira el conteo del producto seleccionado
          </div>

            <GraficoIncidencias issueStats={issueStats} />

        </div>
      </div>
    </div>
  );
}

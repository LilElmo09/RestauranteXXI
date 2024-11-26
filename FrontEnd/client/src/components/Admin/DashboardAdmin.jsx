import React, { useEffect, useState } from "react";
import "./DashboardAdmin.css";
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
        <h1>Dashboard administración</h1>
        <div className="admin-menu">
          {/* Usuarios Totales */}
          <div className="admin-menu-item a">
            <i className="fas fa-user aa"></i>
            <div className="admin-menu-content">
              <h2>Usuarios</h2>
              <small>Gestión de usuarios</small>
              <p>
                <CountUp start={0} end={userStats.total} duration={2} />
              </p>
            </div>
          </div>

          {/* Usuarios Inactivos */}
          <div className="admin-menu-item e">
            <i className="fa-solid fa-user-xmark ee"></i>
            <div className="admin-menu-content">
              <h2>Inactivos</h2>
              <small>Gestión de usuarios</small>
              <p>
                <CountUp start={0} end={userStats.inactivos} duration={2} />
              </p>
            </div>
          </div>

          {/* Usuarios Activos */}
          <div className="admin-menu-item d">
            <i className="fa-solid fa-user-check"></i>
            <div className="admin-menu-content">
              <h2>Activos</h2>
              <small>Gestión de usuarios</small>
              <p>
                <CountUp start={0} end={userStats.activos} duration={2} />
              </p>
            </div>
          </div>

          {/* Productos */}
          <div className="admin-menu-item b">
            <i className="fas fa-utensils bb"></i>
            <div className="admin-menu-content">
              <h2>Productos</h2>
              <small>Gestión de productos</small>
              <p>
                <CountUp start={0} end={80} duration={2} />
              </p>
            </div>
          </div>

          {/* Mesas */}
          <div className="admin-menu-item c">
            <i className="fas fa-chair cc"></i>
            <div className="admin-menu-content">
              <h2>Mesas</h2>
              <small>Gestión de mesas</small>
              <p>
                <CountUp start={0} end={25} duration={2} />
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

          <div className="container-grafics">
            <div className="grafico-general">
              <GraficoGeneral userStats={userStats} issueStats={issueStats} />
            </div>
            <div className="container-countChart">
              <UserCountChart />

              <div className="">
                <GraficoIncidencias issueStats={issueStats} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React from "react";
import { Radar } from "react-chartjs-2";
import { Chart as ChartJS, RadarController, RadialLinearScale, CategoryScale, LinearScale, Title, Tooltip, Legend } from "chart.js";

// Registrar los componentes necesarios de Chart.js
ChartJS.register(RadarController, RadialLinearScale, CategoryScale, LinearScale, Title, Tooltip, Legend);

export default function GraficoRadar({ userStats, issueStats }) {
  const data = {
    labels: ["Activos", "Inactivos", "Resueltos", "En Proceso", "Pendientes"],
    datasets: [
      {
        label: "Estadísticas Generales",
        data: [
          userStats.activos,
          userStats.inactivos,
          issueStats.resueltos,
          issueStats.en_proceso,
          issueStats.pendientes,
        ],
        backgroundColor: "rgba(76, 175, 80, 0.2)",
        borderColor: "#4CAF50",
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      r: {
        beginAtZero: true,
      },
    },
    plugins: {
      title: {
        display: true,
        text: "Resumen General",
      },
    },
  };

  return (
    <div className="radar-chart-container">
      <Radar data={data} options={options} />
    </div>
  );
}

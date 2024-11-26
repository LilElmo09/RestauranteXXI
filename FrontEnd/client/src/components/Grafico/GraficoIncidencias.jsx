// /components/Grafico/GraficoIncidencias.jsx
import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
} from "chart.js";

ChartJS.register(LineElement, PointElement, LinearScale, Title, CategoryScale);

export default function GraficoIncidencias({ issueStats }) {
  // Configuración de los datos para el gráfico
  const data = {
    labels: ["Total", "Pendientes", "En Proceso", "Resueltos"], // Etiquetas para el eje X
    datasets: [
      {
        label: "Incidencias",
        data: [
          issueStats.total,
          issueStats.pendientes,
          issueStats.en_proceso,
          issueStats.resueltos,
        ],
        fill: false,
        borderColor: "#4CAF50", // Color de la línea
        backgroundColor: "#4CAF50",
        tension: 0.3,
      },
    ],
  };

  // Opciones para personalizar el gráfico
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      title: {
        display: true,
        text: "Estadísticas de Incidencias",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return(<div>
    <h2 style={{marginTop:'1rem'}}>Conteo de Incidencias</h2>
    <Line style={{width: '100%'}} data={data} options={options} />;
  </div>);
  
}

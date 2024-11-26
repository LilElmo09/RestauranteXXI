import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, LinearScale, BarElement, CategoryScale, Title, Tooltip, Legend } from 'chart.js';
import axios from 'axios';

// Registrar las escalas y elementos que vas a usar
Chart.register(LinearScale, BarElement, CategoryScale, Title, Tooltip, Legend);

const UserCountChart = () => {
    const [data, setData] = useState({ total: 0, activos: 0, inactivos: 0 });

    useEffect(() => {
        const fetchUserCount = async () => {
            try {
                const response = await axios.get('http://localhost:3000/count-users');
                setData(response.data);
            } catch (error) {
                console.error("Error al obtener los datos de usuarios: ", error);
            }
        };

        fetchUserCount();
    }, []);

    const chartData = {
        labels: ['Total', 'Activos', 'Inactivos'],
        datasets: [
            {
                label: 'Número de Usuarios',
                data: [data.total, data.activos, data.inactivos],
                backgroundColor: [
                    'rgba(74, 144, 226, 0.6)', // Total
                    'rgba(85, 191, 112, 0.6)', // Activos
                    'rgba(230, 76, 76, 0.6)'   // Inactivos
                ],
                borderColor: [
                    'rgba(74, 144, 226, 1)',
                    'rgba(85, 191, 112, 1)',
                    'rgba(230, 76, 76, 1)'
                ],
                borderWidth: 1,
            }
        ]
    };

    const options = {
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Número de Usuarios'
                }
            }
        },
        plugins: {
            legend: {
                display: true,
                position: 'top',
            }
        }
    };

    return (
        <div>
            <h2>Conteo de Usuarios</h2>
            <Bar data={chartData} options={options} />
        </div>
    );
};

export default UserCountChart;

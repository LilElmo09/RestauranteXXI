import React, { useState, useEffect } from 'react';
import './ResumenFinanzas.css';
import resumenData from './resumen.json';

const Finanzas = () => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [income, setIncome] = useState(0);
    const [expenses, setExpenses] = useState(0);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        // Obtener datos de ingresos y salidas desde el archivo JSON
        const { ingresos, salidas } = resumenData;
        setIncome(ingresos);
        setExpenses(salidas);
    }, []);

    const handleDateChange = (e) => {
        const { name, value } = e.target;
        if (name === 'startDate') {
            setStartDate(value);
        } else {
            setEndDate(value);
        }
    };

    const calculateSummary = () => {
        // Lógica para calcular ingresos y salidas basados en el rango de fechas
        // setIncome(calculatedIncome);
        // setExpenses(calculatedExpenses);
        setTotal(income - expenses);
    };

    return (
        <div className="finanzas-container">
            <div className="date-container">
                <div>
                    <label>Fecha de inicio:</label>
                    <input type="date" name="startDate" value={startDate} onChange={handleDateChange} />
                </div>
                <div>
                    <label>Fecha de fin:</label>
                    <input type="date" name="endDate" value={endDate} onChange={handleDateChange} />
                </div>
            </div>
            <button onClick={calculateSummary}>Calcular Resumen</button>
            <div>
                <h3>Ingresos: ${income}</h3>
                <h3>Salidas: ${expenses}</h3>
                <h3>Total: ${total}</h3>
            </div>
        </div>
    );
};

export default Finanzas;

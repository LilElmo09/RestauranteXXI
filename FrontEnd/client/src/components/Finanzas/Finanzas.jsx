import React, { useState } from 'react';
import ResumenFinanzas from '../ResumenFinanzas/ResumenFinanzas';
import DetalleFinanzas from '../DetalleFinanzas/DetalleFinanzas';
import './Finanzas.css';

const Finanzas = () => {
    const [tipo, setTipo] = useState('ingresos');

    return (
        <div className="finanzas-page">
            <h2>Resumen de Finanzas</h2>
            <div className="finanzas-tabs">
                <ResumenFinanzas />
                <DetalleFinanzas tipo={tipo} setTipo={setTipo} />
            </div>
        </div>
    );
};

export default Finanzas;

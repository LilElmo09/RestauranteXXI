import React from 'react';
import detalles from './detalles.json';
import './DetalleFinanzas.css';

const DetalleFinanzas = ({ tipo, setTipo }) => {
    const data = detalles[tipo];

    return (
        <div className="detalle-finanzas">
            <div className="botones">
                <button id='btningreso' onClick={() => setTipo('ingresos')}>Ingresos</button>
                <button id='btnsalida' onClick={() => setTipo('salidas')}>Salida</button>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Descripción</th>
                        <th>Monto</th>
                        <th>Fecha</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => (
                        <tr key={index}>
                            <td>{item.descripcion}</td>
                            <td>{item.monto}</td>
                            <td>{item.fecha}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DetalleFinanzas;

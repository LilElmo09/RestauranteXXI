// src/components/Menu/Menu.jsx
import React from 'react';
import './Menu.css';

import terneraImage from '../../images/ternera.jpg';
import cerdoImage from '../../images/cerdo.jpg';
import polloImage from '../../images/pollo.jpg';
import pescadosImage from '../../images/pescados.jpg';
import entradasImage from '../../images/entradas.jpg';
import bebidasImage from '../../images/bebidas.jpg';
import postresImage from '../../images/postres.jpg';
import acompanamientosImage from '../../images/acompanamientos.jpg';

export default function Menu() {
    return (
        <div className="menu-container">
            <h1>Menú Parrilla Entre Amigos</h1>
            
            {/* Entradas */}
            <div className="menu-section">
                <div className="section-header">
                    <h2>Entradas</h2>
                </div>
                <div className="section-content">
                    <ul>
                        <li>Empanadas de queso <span>$5</span></li>
                        <li>Antipasto mixto <span>$8</span></li>
                        <li>Bruschettas <span>$6</span></li>
                        <li>Ceviche <span>$10</span></li>
                    </ul>
                    <img src={entradasImage} alt="Entradas" className="menu-image" />
                </div>
            </div>

            {/* Carne de Ternera */}
            <div className="menu-section">
                <div className="section-header">
                    <h2>Carne de Ternera</h2>
                </div>
                <div className="section-content">
                    <ul>
                        <li>Con papas fritas <span>$7</span></li>
                        <li>Con ensaladilla <span>$8</span></li>
                        <li>Costilla <span>$12</span></li>
                        <li>Chuletas <span>$16</span></li>
                        <li>Ahumada <span>$12</span></li>
                    </ul>
                    <img src={terneraImage} alt="Carne de Ternera" className="menu-image" />
                </div>
            </div>

            {/* Carne de Cerdo */}
            <div className="menu-section">
                <div className="section-header">
                    <h2>Carne de Cerdo</h2>
                </div>
                <div className="section-content">
                    <ul>
                        <li>Con papas fritas <span>$7</span></li>
                        <li>Con ensaladilla <span>$15</span></li>
                        <li>Costilla <span>$12</span></li>
                        <li>Chuletas <span>$16</span></li>
                        <li>Ahumada <span>$12</span></li>
                    </ul>
                    <img src={cerdoImage} alt="Carne de Cerdo" className="menu-image" />
                </div>
            </div>

            {/* Carne de Pollo */}
            <div className="menu-section">
                <div className="section-header">
                    <h2>Carne de Pollo</h2>
                </div>
                <div className="section-content">
                    <ul>
                        <li>Con papas fritas <span>$9</span></li>
                        <li>Con ensaladilla <span>$10</span></li>
                        <li>Trasero <span>$14</span></li>
                        <li>Pechuga <span>$17</span></li>
                        <li>Carne ahumada <span>$12</span></li>
                    </ul>
                    <img src={polloImage} alt="Carne de Pollo" className="menu-image" />
                </div>
            </div>

            {/* Pescados */}
            <div className="menu-section">
                <div className="section-header">
                    <h2>Pescados</h2>
                </div>
                <div className="section-content">
                    <ul>
                        <li>Con mariscos <span>$7</span></li>
                        <li>Pulpo <span>$15</span></li>
                        <li>Salmón <span>$13</span></li>
                        <li>Sardinas <span>$11</span></li>
                        <li>Pescado ahumado <span>$12</span></li>
                    </ul>
                    <img src={pescadosImage} alt="Pescados" className="menu-image" />
                </div>
            </div>

            {/* Acompañamientos */}
            <div className="menu-section">
                <div className="section-header">
                    <h2>Acompañamientos</h2>
                </div>
                <div className="section-content">
                    <ul>
                        <li>Papas fritas <span>$3</span></li>
                        <li>Puré de papas <span>$4</span></li>
                        <li>Ensalada mixta <span>$4</span></li>
                        <li>Vegetales asados <span>$5</span></li>
                    </ul>
                    <img src={acompanamientosImage} alt="Acompañamientos" className="menu-image" />
                </div>
            </div>

            {/* Bebidas */}
            <div className="menu-section">
                <div className="section-header">
                    <h2>Bebidas</h2>
                </div>
                <div className="section-content">
                    <ul>
                        <li>Refresco <span>$2</span></li>
                        <li>Cerveza artesanal <span>$5</span></li>
                        <li>Vino tinto <span>$8</span></li>
                        <li>Cóctel de la casa <span>$7</span></li>
                    </ul>
                    <img src={bebidasImage} alt="Bebidas" className="menu-image" />
                </div>
            </div>

            {/* Postres */}
            <div className="menu-section">
                <div className="section-header">
                    <h2>Postres</h2>
                </div>
                <div className="section-content">
                    <ul>
                        <li>Torta de chocolate <span>$6</span></li>
                        <li>Helado <span>$4</span></li>
                        <li>Frutas frescas <span>$5</span></li>
                        <li>Crema catalana <span>$7</span></li>
                    </ul>
                    <img src={postresImage} alt="Postres" className="menu-image" />
                </div>
            </div>
        </div>
    );
}
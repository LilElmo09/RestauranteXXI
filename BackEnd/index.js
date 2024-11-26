// src/index.js

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');
const userRoutes = require('./routes/user.routes');
const adminRoutes = require('./routes/admin.routes');
const cocinaRoutes = require('./routes/cocina.routes'); // Importar las rutas de cocina
const finanzasRouter = require('./routes/finanzas.routes');
const bodegaRouter = require('./routes/bodega.routes');

const { config } = require('dotenv');
config();

const app = express();

// Middlewares
app.use(cors()); // Habilitado para todas las rutas temporalmente
app.use(morgan('dev'));
app.use(express.json());

// Servir archivos estáticos desde la carpeta 'images'
app.use('/images/', express.static(path.join(__dirname, 'images')));

// Rutas
app.use(userRoutes);
app.use(adminRoutes);
app.use('/api/',cocinaRoutes); // Usar las rutas de cocina
app.use('/api/finanzas', finanzasRouter);
app.use('/api/bodega', bodegaRouter);

// Manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack); // Para depuración
    return res.status(500).json({
        message: err.message,
    });
});

// Escuchar en el puerto especificado
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

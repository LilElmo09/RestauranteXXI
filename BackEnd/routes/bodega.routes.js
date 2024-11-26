// routes/bodega.routes.js

const express = require('express');
const router = express.Router();
const BodegaController = require('../controllers/bodega.controllers');

// Obtener todos los ítems de bodega
router.get('/', BodegaController.getAllItems);

// Crear un nuevo ítem de bodega
router.post('/', BodegaController.createItem);

// Actualizar un ítem de bodega
router.put('/:id', BodegaController.updateItem);

// Eliminar un ítem de bodega
router.delete('/:id', BodegaController.deleteItem);

// Obtener datos del dashboard de bodega
router.get('/dashboard-data', BodegaController.getDashboardData);

module.exports = router;

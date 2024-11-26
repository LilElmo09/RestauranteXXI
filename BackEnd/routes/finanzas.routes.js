// routes/finanzas.routes.js

const express = require('express');
const router = express.Router();
const FinanzasController = require('../controllers/finanzas.controllers');

// Rutas para las finanzas

// Obtener todas las transacciones financieras
router.get('/', FinanzasController.getAllTransactions);

// Crear una nueva transacción financiera
router.post('/', FinanzasController.createTransaction);

// Actualizar una transacción financiera
router.put('/:id', FinanzasController.updateTransaction);

// Eliminar una transacción financiera
router.delete('/:id', FinanzasController.deleteTransaction);

// Obtener el balance diario
router.get('/balance-diario', FinanzasController.getDailyBalances);

// Obtener el balance mensual
router.get('/balance-mensual', FinanzasController.getMonthlyBalances);

// Obtener ingresos y egresos diarios
router.get('/ingresos-egresos-diarios', FinanzasController.getIngresosEgresosDiarios);

// Obtener ingresos y egresos mensuales
router.get('/ingresos-egresos-mensuales', FinanzasController.getIngresosEgresosMensuales);


module.exports = router;

const express = require('express');
const router = express.Router();
const CocinaController = require('../controllers/cocina.controllers');

// Rutas actualizadas
router.get('/cocina/comandas', CocinaController.getAllComandas);
router.post('/cocina/compras/:id/tiempo', CocinaController.assignTiempoEstimado);
router.put('/cocina/compras/:id/finalizar', CocinaController.finalizarCompra);
router.post('/cocina/compras/:id/reanudar', CocinaController.reanudarCompra);
router.get('/clientes/:id/pedidos', CocinaController.getPedidosCliente);
router.delete('/clientes/:usuario_id/pedidos/:id', CocinaController.cancelarPedido);

//Rutas recetas

router.get('/recetas/', CocinaController.getAllRecetas);
router.post('/recetas/', CocinaController.createReceta);
router.delete('/recetas/:id', CocinaController.deleteReceta);
router.put('/recetas/:id', CocinaController.updateReceta);

//Rutas para obtener el conteo de dashboard de cocina

router.get('/cocina/count-recetas', CocinaController.countRecetas);
router.get('/cocina/count-comandas', CocinaController.countComandas);
router.get('/cocina/recetas-productos-stats', CocinaController.getRecetasProductosStats);

module.exports = router;

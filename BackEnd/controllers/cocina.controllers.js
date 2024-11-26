// src/controllers/cocina.controllers.js

const Cocina = require('../models/cocina.models');

class CocinaController {

   // Obtener todas las comandas para la cocina
   static async getAllComandas(req, res, next) {
    try {
        const comandas = await Cocina.getAllOrders();
        res.json(comandas);
    } catch (error) {
        next(error);
    }
}

// Asignar tiempo estimado a una compra completa
static async assignTiempoEstimado(req, res, next) {
    const compra_id = parseInt(req.params.id, 10);
    const { tiempo_preparacion } = req.body;

    if (isNaN(compra_id) || typeof tiempo_preparacion !== 'number') {
        return res.status(400).json({ message: 'Parámetros inválidos' });
    }

    try {
        const updatedData = await Cocina.assignEstimatedTime(compra_id, tiempo_preparacion);
        res.json(updatedData);
    } catch (error) {
        next(error);
    }
}

// Finalizar una compra
static async finalizarCompra(req, res, next) {
    const compra_id = parseInt(req.params.id, 10);

    if (isNaN(compra_id)) {
        return res.status(400).json({ message: 'Parámetros inválidos' });
    }

    try {
        const updatedCompra = await Cocina.updateOrderStatus(compra_id, 3); // 3: Resuelto
        res.json(updatedCompra);
    } catch (error) {
        next(error);
    }
}










static async reanudarCompra(req, res, next) {
    const compra_id = parseInt(req.params.id, 10);
    const { tiempo_preparacion } = req.body;

    if (isNaN(compra_id) || typeof tiempo_preparacion !== 'number') {
        return res.status(400).json({ message: 'Parámetros inválidos' });
    }

    try {
        // Reasignar tiempo y cambiar estado a En curso
        const updatedCompra = await Cocina.assignEstimatedTime(compra_id, tiempo_preparacion);
        res.json(updatedCompra);
    } catch (error) {
        next(error);
    }
}

   // Obtener pedidos pendientes y en curso para un cliente
   static async getPedidosCliente(req, res, next) {
    const usuario_id = parseInt(req.params.id, 10);

    if (isNaN(usuario_id)) {
        return res.status(400).json({ message: 'Parámetros inválidos' });
    }

    try {
        const pedidos = await Cocina.getPendingAndInProgressOrders(usuario_id);
        res.json(pedidos);
    } catch (error) {
        next(error);
    }
}

    // Cancelar un pedido por parte del cliente
    static async cancelarPedido(req, res, next) {
        const compra_id = parseInt(req.params.id, 10);
        const { usuario_id } = req.body;

        if (isNaN(compra_id) || !usuario_id) {
            return res.status(400).json({ message: 'Parámetros inválidos' });
        }

        try {
            const canceledCompra = await Cocina.cancelOrder(compra_id, usuario_id);
            res.json(canceledCompra);
        } catch (error) {
            console.error("Error al cancelar el pedido:", error);
            res.status(400).json({ message: error.message });
        }
    }

    //Recetas del apartado de cocina

    static async getAllRecetas(req, res, next) {
        try {
            const recetas = await Cocina.getAllRecetas();
            return res.status(200).json(recetas);
        } catch (error) {
            next(error);
        }
    }


// En cocina.controllers.js

static async createReceta(req, res, next) {
    const { instrucciones, ingredientes, producto_id } = req.body;

    if (!instrucciones || !ingredientes || !producto_id) {
        return res.status(400).json({ message: 'Faltan campos obligatorios' });
    }

    try {
        // Crear la receta
        const newRecetaId = await Cocina.createReceta(instrucciones, ingredientes, producto_id);

        // Obtener la receta completa
        const recetaCompleta = await Cocina.getRecetaById(newRecetaId.id);

        if (!recetaCompleta) {
            return res.status(404).json({ message: 'Receta no encontrada después de crearla' });
        }

        res.status(201).json(recetaCompleta);
    } catch (error) {
        next(error);
    }
}


    static async updateReceta(req, res, next) {
        const receta_id = parseInt(req.params.id, 10);
        const { instrucciones, ingredientes, producto_id } = req.body;
    
        if (isNaN(receta_id) || !instrucciones || !ingredientes || !producto_id) {
            return res.status(400).json({ message: 'Parámetros inválidos' });
        }
    
        try {
            // Actualizar la receta
            await Cocina.updateReceta(instrucciones, ingredientes, producto_id, receta_id);
    
            // Obtener la receta actualizada
            const updatedReceta = await Cocina.getRecetaById(receta_id);
    
            if (!updatedReceta) {
                return res.status(404).json({ message: 'Receta no encontrada' });
            }
    
            res.json(updatedReceta);
        } catch (error) {
            next(error);
        }
    }
    

    static async deleteReceta(req, res, next) {
        const receta_id = parseInt(req.params.id, 10);

        if (isNaN(receta_id)) {
            return res.status(400).json({ message: 'Parámetros inválidos' });
        }

        try {
            await Cocina.deleteReceta(receta_id);
            res.json({ message: 'Receta eliminada' });
        } catch (error) {
            next(error);
        }
    }

    static async countRecetas(req, res, next) {
        try {
          const total = await Cocina.countRecetas();
          res.json({ total });
        } catch (error) {
          next(error);
        }
      }
    
      // Obtener el conteo de comandas por estado
      static async countComandas(req, res, next) {
        try {
          const stats = await Cocina.countComandas();
          res.json(stats);
        } catch (error) {
          next(error);
        }
      }
    
      static async getRecetasProductosStats(req, res, next) {
        try {
          const stats = await Cocina.getRecetasProductosStats();
          res.json(stats);
        } catch (error) {
          next(error);
        }
      }
}

module.exports = CocinaController;

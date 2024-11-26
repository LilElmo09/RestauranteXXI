// controllers/bodega.controllers.js

const BodegaModel = require('../models/bodega.models');
const FinanzasModel = require('../models/finanzas.models'); // Asegúrate de importar el modelo de finanzas

const BodegaController = {
    getAllItems: async (req, res) => {
        try {
            const items = await BodegaModel.getAllItems();
            res.json(items);
        } catch (error) {
            console.error('Error al obtener los ítems de bodega:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    },

    createItem: async (req, res) => {
        const { proveedor, producto, cantidad, valor_unitario } = req.body;
        try {
            const montoTotal = cantidad * valor_unitario;

            // Crear el egreso en finanzas
            const transaccionFinanzas = await FinanzasModel.createTransaccion(
                'Egreso',
                `Compra de ${cantidad} unidades de ${producto} al proveedor ${proveedor}`,
                montoTotal
            );

            // Crear el ítem en bodega con la referencia a finanzas
            const newItem = await BodegaModel.createItem(
                proveedor,
                producto,
                cantidad,
                valor_unitario,
                transaccionFinanzas.id
            );

            res.status(201).json(newItem);
        } catch (error) {
            console.error('Error al crear el ítem de bodega:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    },

    updateItem: async (req, res) => {
        const { id } = req.params;
        const { proveedor, producto, cantidad, valor_unitario } = req.body;
        try {
            const existingItem = await BodegaModel.getItemById(id);
            if (!existingItem) {
                return res.status(404).json({ error: 'Ítem no encontrado' });
            }

            // Calcular el monto total anterior y nuevo
            const montoAnterior = existingItem.cantidad * existingItem.valor_unitario;
            const montoNuevo = cantidad * valor_unitario;
            const diferenciaMonto = montoNuevo - montoAnterior;

            // Actualizar el egreso en finanzas si hay cambios en el monto
            if (diferenciaMonto !== 0) {
                await FinanzasModel.updateTransaction(
                    existingItem.transaccion_finanzas_id,
                    'Egreso',
                    `Compra de ${cantidad} unidades de ${producto} al proveedor ${proveedor}`,
                    montoNuevo
                );
            }

            // Actualizar el ítem en bodega
            const updatedItem = await BodegaModel.updateItem(
                id,
                proveedor,
                producto,
                cantidad,
                valor_unitario
            );

            res.json(updatedItem);
        } catch (error) {
            console.error('Error al actualizar el ítem de bodega:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    },

    getDashboardData: async (req, res) => {
        try {
            const totalItems = await BodegaModel.getTotalItems();
            const totalUnits = await BodegaModel.getTotalUnits();
            const totalValue = await BodegaModel.getTotalInventoryValue();
            const unitsPerProduct = await BodegaModel.getUnitsPerProduct();
            const valuePerProduct = await BodegaModel.getValuePerProduct();

            res.json({
                totalItems,
                totalUnits,
                totalValue,
                unitsPerProduct,
                valuePerProduct,
            });
        } catch (error) {
            console.error('Error al obtener datos del dashboard de bodega:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    },

    deleteItem: async (req, res) => {
        const { id } = req.params;
        try {
            const item = await BodegaModel.deleteItem(id);

            if (!item) {
                return res.status(404).json({ error: 'Ítem no encontrado' });
            }

            // Eliminar la transacción en finanzas asociada
            await FinanzasModel.deleteTransaction(item.transaccion_finanzas_id);

            res.json({ message: 'Ítem eliminado correctamente' });
        } catch (error) {
            console.error('Error al eliminar el ítem de bodega:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    
};

module.exports = BodegaController;

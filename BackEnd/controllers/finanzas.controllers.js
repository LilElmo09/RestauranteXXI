// controllers/finanzas.controllers.js

const FinanzasModel = require('../models/finanzas.models');

const FinanzasController = {
    getAllTransactions: async (req, res) => {
        try {
            const transactions = await FinanzasModel.getAllTransactions();
            res.json(transactions);
        } catch (error) {
            console.error('Error al obtener las transacciones financieras:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    },

    createTransaction: async (req, res) => {
        const { tipo, concepto, monto } = req.body;
        try {
            const newTransaction = await FinanzasModel.createTransaccion(tipo, concepto, monto);
            res.status(201).json(newTransaction);
        } catch (error) {
            console.error('Error al crear la transacción financiera:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    },

    updateTransaction: async (req, res) => {
        const { id } = req.params;
        const { tipo, concepto, monto } = req.body;
        try {
            const updatedTransaction = await FinanzasModel.updateTransaction(id, tipo, concepto, monto);
            if (!updatedTransaction) {
                return res.status(404).json({ error: 'Transacción financiera no encontrada' });
            }
            res.json(updatedTransaction);
        } catch (error) {
            console.error('Error al actualizar la transacción financiera:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    },

    deleteTransaction: async (req, res) => {
        const { id } = req.params;
        try {
            const deletedTransaction = await FinanzasModel.deleteTransaction(id);
            if (!deletedTransaction) {
                return res.status(404).json({ error: 'Transacción financiera no encontrada' });
            }
            res.json({ message: 'Transacción financiera eliminada correctamente' });
        } catch (error) {
            console.error('Error al eliminar la transacción financiera:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    },

    getMonthlyBalances: async (req, res) => {
        try {
            const balances = await FinanzasModel.getMonthlyBalances();
            res.json(balances);
        } catch (error) {
            console.error('Error al obtener el balance mensual:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    },
    
    getIngresosEgresosDiarios: async (req, res) => {
        try {
            const ingresos = await FinanzasModel.getIngresosEgresosDiarios('Ingreso');
            const egresos = await FinanzasModel.getIngresosEgresosDiarios('Egreso');
            res.json({ ingresos, egresos });
        } catch (error) {
            console.error('Error al obtener ingresos y egresos diarios:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    },

    getIngresosEgresosMensuales: async (req, res) => {
        try {
            const ingresos = await FinanzasModel.getIngresosEgresosMensuales('Ingreso');
            const egresos = await FinanzasModel.getIngresosEgresosMensuales('Egreso');
            res.json({ ingresos, egresos });
        } catch (error) {
            console.error('Error al obtener ingresos y egresos mensuales:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    },
    getDailyBalances: async (req, res) => {
        try {
            const balances = await FinanzasModel.getDailyBalances();
            res.json(balances);
        } catch (error) {
            console.error('Error al obtener el balance diario:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    },
};

module.exports = FinanzasController;

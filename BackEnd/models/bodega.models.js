// models/bodega.models.js

const pool = require('../db');

const BodegaModel = {
    getAllItems: async () => {
        const result = await pool.query('SELECT * FROM bodega ORDER BY fecha DESC');
        return result.rows;
    },

    createItem: async (proveedor, producto, cantidad, valor_unitario, transaccion_finanzas_id) => {
        const result = await pool.query(
            'INSERT INTO bodega (proveedor, producto, cantidad, valor_unitario, transaccion_finanzas_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [proveedor, producto, cantidad, valor_unitario, transaccion_finanzas_id]
        );
        return result.rows[0];
    },

    updateItem: async (id, proveedor, producto, cantidad, valor_unitario) => {
        const result = await pool.query(
            'UPDATE bodega SET proveedor = $1, producto = $2, cantidad = $3, valor_unitario = $4 WHERE id = $5 RETURNING *',
            [proveedor, producto, cantidad, valor_unitario, id]
        );
        return result.rows[0];
    },

    getTotalItems: async () => {
        const result = await pool.query('SELECT COUNT(DISTINCT producto) AS total_items FROM bodega');
        return result.rows[0].total_items;
    },

    getTotalUnits: async () => {
        const result = await pool.query('SELECT SUM(cantidad) AS total_units FROM bodega');
        return result.rows[0].total_units;
    },

    getTotalInventoryValue: async () => {
        const result = await pool.query('SELECT SUM(cantidad * valor_unitario) AS total_value FROM bodega');
        return result.rows[0].total_value;
    },

    getUnitsPerProduct: async () => {
        const result = await pool.query(`
            SELECT producto, SUM(cantidad) AS total_units
            FROM bodega
            GROUP BY producto
            ORDER BY total_units DESC
        `);
        return result.rows;
    },

    getValuePerProduct: async () => {
        const result = await pool.query(`
            SELECT producto, SUM(cantidad * valor_unitario) AS total_value
            FROM bodega
            GROUP BY producto
            ORDER BY total_value DESC
        `);
        return result.rows;
    },

    deleteItem: async (id) => {
        const result = await pool.query('DELETE FROM bodega WHERE id = $1 RETURNING *', [id]);
        return result.rows[0];
    },

    getItemById: async (id) => {
        const result = await pool.query('SELECT * FROM bodega WHERE id = $1', [id]);
        return result.rows[0];
    }
};

module.exports = BodegaModel;

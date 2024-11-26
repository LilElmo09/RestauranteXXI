// models/finanzas.models.js

const pool = require('../db'); // Ajusta la ruta según tu estructura de proyecto

const FinanzasModel = {
    getAllTransactions: async () => {
        const result = await pool.query('SELECT * FROM finanzas ORDER BY fecha DESC');
        return result.rows;
    },

    getMonthlyBalances: async () => {
        const result = await pool.query(`
            SELECT
                TO_CHAR(fecha, 'YYYY-MM') AS mes,
                SUM(CASE WHEN tipo = 'Ingreso' THEN monto ELSE -monto END) AS balance
            FROM finanzas
            GROUP BY TO_CHAR(fecha, 'YYYY-MM')
            ORDER BY TO_CHAR(fecha, 'YYYY-MM') DESC
        `);
        return result.rows;
    },

    createTransaccion: async (tipo, concepto, monto) => { // Método renombrado a 'createTransaccion'
        try {
            const result = await pool.query(
                'INSERT INTO finanzas (tipo, concepto, monto) VALUES ($1, $2, $3) RETURNING *',
                [tipo, concepto, monto]
            );
            console.log('Transacción en finanzas creada:', result.rows[0]);
            return result.rows[0];
        } catch (error) {
            console.error('Error al crear transacción en finanzas:', error);
            throw error;
        }
    },

    updateTransaction: async (id, tipo, concepto, monto) => {
        const result = await pool.query(
            'UPDATE finanzas SET tipo = $1, concepto = $2, monto = $3 WHERE id = $4 RETURNING *',
            [tipo, concepto, monto, id]
        );
        return result.rows[0];
    },

    deleteTransaction: async (id) => {
        const result = await pool.query('DELETE FROM finanzas WHERE id = $1 RETURNING *', [id]);
        return result.rows[0];
    },

    getIngresosEgresosDiarios: async (tipo) => {
        const result = await pool.query(`
            SELECT DATE(fecha) AS fecha, SUM(monto) AS total
            FROM finanzas
            WHERE tipo = $1
            GROUP BY DATE(fecha)
            ORDER BY DATE(fecha) ASC
        `, [tipo]);
        return result.rows;
    },

    getIngresosEgresosMensuales: async (tipo) => {
        const result = await pool.query(`
            SELECT TO_CHAR(fecha, 'YYYY-MM') AS mes, SUM(monto) AS total
            FROM finanzas
            WHERE tipo = $1
            GROUP BY TO_CHAR(fecha, 'YYYY-MM')
            ORDER BY TO_CHAR(fecha, 'YYYY-MM') ASC
        `, [tipo]);
        return result.rows;
    },

    getDailyBalances: async () => {
        const result = await pool.query(`
            SELECT
                DATE(fecha) AS fecha,
                SUM(CASE WHEN tipo = 'Ingreso' THEN monto ELSE -monto END) AS balance
            FROM finanzas
            GROUP BY DATE(fecha)
            ORDER BY DATE(fecha) DESC
        `);
        return result.rows;
    }
};

module.exports = FinanzasModel;

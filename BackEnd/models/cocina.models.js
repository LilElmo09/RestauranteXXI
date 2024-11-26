// src/models/cocina.models.js

const pool = require('../db');

class Cocina {

    // Obtener todos los pedidos para la cocina
    static async getAllOrders() {
        try {
            const result = await pool.query(
                `SELECT 
                    c.id AS comanda_id,
                    u.nombre AS cliente_nombre,
                    u.apellido AS cliente_apellido,
                    p.nombre AS producto_nombre,
                    c.cantidad,
                    c.tiempo_preparacion,
                    e_comanda.nombre AS estado_comanda,
                    c.fecha_comanda,
                    compra.total,
                    compra.tiempo_preparacion AS tiempo_estimada,
                    compra.fecha_compra,
                    compra.id AS compra_id,
                    e_compra.nombre AS estado_compra
                FROM comandas c
                JOIN compras compra ON c.compra_id = compra.id
                JOIN usuarios u ON compra.usuario_id = u.id
                JOIN productos p ON c.producto_id = p.id
                JOIN estados e_comanda ON c.estado_id = e_comanda.id
                JOIN estados e_compra ON compra.estado_id = e_compra.id
                WHERE e_comanda.nombre != 'Cancelada' AND e_compra.nombre != 'Cancelada'
                ORDER BY compra.fecha_compra DESC` // Ordenar por fecha de compra
            );
            return result.rows;
        } catch (error) {
            console.error("Error en getAllOrders:", error.message);
            throw error;
        }
    }

    // Asignar tiempo estimado a una compra completa
    static async assignEstimatedTime(compra_id, tiempo_preparacion) {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            // Actualizar la compra
            const compraResult = await client.query(
                `UPDATE compras 
                 SET tiempo_preparacion = $1, estado_id = 2, fecha_compra = NOW()
                 WHERE id = $2
                 RETURNING *`,
                [tiempo_preparacion, compra_id]
            );

            if (compraResult.rowCount === 0) {
                throw new Error('Compra no encontrada o ya está en estado "En curso" o superior.');
            }

            // Actualizar todas las comandas asociadas a esta compra a 'En curso' (estado_id = 2)
            const comandasResult = await client.query(
                `UPDATE comandas 
                 SET estado_id = 2
                 WHERE compra_id = $1
                 RETURNING *`,
                [compra_id]
            );

            await client.query('COMMIT');

            // Retornar la compra actualizada junto con las comandas actualizadas
            return {
                compra: compraResult.rows[0],
                comandas: comandasResult.rows
            };
        } catch (error) {
            await client.query('ROLLBACK');
            console.error("Error en assignEstimatedTime:", error.message);
            throw error;
        } finally {
            client.release();
        }
    }

    

  // Obtener pedidos pendientes y en curso para un cliente
  static async getPendingAndInProgressOrders(usuario_id) {
    try {
        const result = await pool.query(
            `SELECT 
                compra.id AS compra_id,
                compra.total,
                compra.fecha_compra,
                compra.tiempo_preparacion AS tiempo_estimada,
                e.nombre AS estado,
                c.id AS comanda_id,
                p.nombre AS producto_nombre,
                c.cantidad
            FROM compras compra
            JOIN estados e ON compra.estado_id = e.id
            JOIN comandas c ON compra.id = c.compra_id
            JOIN productos p ON c.producto_id = p.id
            WHERE compra.usuario_id = $1 AND compra.estado_id IN (1, 2)
            ORDER BY compra.fecha_compra DESC`,
            [usuario_id]
        );
        return result.rows;
    } catch (error) {
        console.error("Error en getPendingAndInProgressOrders:", error.message);
        throw error;
    }
}

    // Cancelar una compra (pedido completo)
    static async cancelOrder(compra_id, usuario_id) {
        try {
            // Verificar que la compra pertenece al usuario y está en estado Pendiente (1)
            const checkResult = await pool.query(
                `SELECT * FROM compras 
                 WHERE id = $1 AND usuario_id = $2 AND estado_id = 1`,
                [compra_id, usuario_id]
            );

            if (checkResult.rows.length === 0) {
                throw new Error('Compra no encontrada, no pertenece al usuario o no está en estado Pendiente');
            }

            // Actualizar el estado a Cancelada (8)
            const updateResult = await pool.query(
                `UPDATE compras 
                 SET estado_id = 8, fecha_compra = NOW()
                 WHERE id = $1
                 RETURNING *`,
                [compra_id]
            );

            // Actualizar las comandas asociadas a esta compra a Cancelada (8)
            await pool.query(
                `UPDATE comandas 
                 SET estado_id = 8
                 WHERE compra_id = $1`,
                [compra_id]
            );

            return updateResult.rows[0];
        } catch (error) {
            console.error("Error en cancelOrder:", error.message);
            throw error;
        }
    }

   



    // Actualizar estado de una compra
    static async updateOrderStatus(compra_id, estado_id) {
        try {
            const result = await pool.query(
                `UPDATE compras 
                 SET estado_id = $1, fecha_compra = NOW()
                 WHERE id = $2
                 RETURNING *`,
                [estado_id, compra_id]
            );

            // Sincronizar el estado en las comandas asociadas
            await pool.query(
                `UPDATE comandas 
                 SET estado_id = $1
                 WHERE compra_id = $2`,
                [estado_id, compra_id]
            );

            return result.rows[0];
        } catch (error) {
            console.error("Error en updateOrderStatus:", error.message);
            throw error;
        }
    }
    

    // Cancelar una compra (pedido completo)
    static async cancelOrder(compra_id, usuario_id) {
        try {
            // Iniciar una transacción para asegurar la atomicidad
            const client = await pool.connect();
            try {
                await client.query('BEGIN');

                // Verificar que la compra pertenece al usuario y está en estado Pendiente (1)
                const checkResult = await client.query(
                    `SELECT * FROM compras 
                     WHERE id = $1 AND usuario_id = $2 AND estado_id = 1
                     FOR UPDATE`,
                    [compra_id, usuario_id]
                );

                if (checkResult.rows.length === 0) {
                    throw new Error('Compra no encontrada, no pertenece al usuario o no está en estado Pendiente');
                }

                // Actualizar el estado a Cancelada (8) en la tabla compras
                const updateCompraResult = await client.query(
                    `UPDATE compras 
                     SET estado_id = 8, fecha_compra = NOW()
                     WHERE id = $1
                     RETURNING *`,
                    [compra_id]
                );

                // Actualizar el estado de todas las comandas asociadas a esta compra a 'Cancelada' (8)
                await client.query(
                    `UPDATE comandas 
                     SET estado_id = 8
                     WHERE compra_id = $1`,
                    [compra_id]
                );

                await client.query('COMMIT');

                return updateCompraResult.rows[0];
            } catch (error) {
                await client.query('ROLLBACK');
                throw error;
            } finally {
                client.release();
            }
        } catch (error) {
            console.error("Error en cancelOrder:", error.message);
            throw error;
        }
    }

    static async getAllRecetas() {
        try {
            const result = await pool.query(
                `SELECT r.id as id_receta, p.nombre as nombre_producto, r.instrucciones as instrucciones, r.ingredientes, imagen_url FROM recetas r inner JOIN productos p ON r.producto_id = p.id ORDER BY r.id DESC
`
            );
            return result.rows;
        } catch (error) {
            console.error("Error en getAllRecetas:", error.message);
            throw error;
        }
    }

    static async createReceta(instrucciones, ingredientes, producto_id) {
        try {
            const result = await pool.query(
                `INSERT INTO recetas (instrucciones, ingredientes, producto_id)
                 VALUES ($1, $2, $3)
                 RETURNING id`,
                [instrucciones, ingredientes, producto_id]
            );
            return result.rows[0]; // Retornamos el ID de la nueva receta
        } catch (error) {
            console.error("Error en createReceta:", error.message);
            throw error;
        }
    }
    

    static async updateReceta(instrucciones, ingredientes, producto_id, receta_id) {
        try {
            const result = await pool.query(
                `UPDATE recetas 
                 SET instrucciones = $1, ingredientes = $2, producto_id = $3
                 WHERE id = $4
                 RETURNING *`,
                [instrucciones, ingredientes, producto_id, receta_id]
            );
            return result.rows[0];
        } catch (error) {
            console.error("Error en updateReceta:", error.message);
            throw error;
        }
    }

    static async deleteReceta(receta_id) {
        try {
            const result = await pool.query(
                `DELETE FROM recetas 
                 WHERE id = $1
                 RETURNING *`,
                [receta_id]
            );
            return result.rows[0];
        } catch (error) {
            console.error("Error en deleteReceta:", error.message);
            throw error;
        }
    }



    static async getRecetaById(receta_id) {
        try {
            const result = await pool.query(
                `SELECT 
                    r.id AS id_receta, 
                    p.nombre AS nombre_producto, 
                    r.instrucciones, 
                    r.ingredientes, 
                    p.imagen_url 
                FROM recetas r 
                INNER JOIN productos p ON r.producto_id = p.id
                WHERE r.id = $1`,
                [receta_id]
            );
            return result.rows[0];
        } catch (error) {
            console.error("Error en getRecetaById:", error.message);
            throw error;
        }
    }

     // Contar el total de recetas
  static async countRecetas() {
    try {
      const result = await pool.query(`SELECT COUNT(*) AS total FROM recetas`);
      return parseInt(result.rows[0].total, 10);
    } catch (error) {
      console.error("Error en countRecetas:", error.message);
      throw error;
    }
  }

  // Contar comandas por estado
  static async countComandas() {
    try {
      const result = await pool.query(`
        SELECT 
          COUNT(*) AS total,
          SUM(CASE WHEN e.nombre = 'Pendiente' THEN 1 ELSE 0 END) AS pendientes,
          SUM(CASE WHEN e.nombre = 'En curso' THEN 1 ELSE 0 END) AS en_curso,
          SUM(CASE WHEN e.nombre = 'Resuelto' THEN 1 ELSE 0 END) AS resueltas
        FROM comandas c
        JOIN estados e ON c.estado_id = e.id
      `);

      return {
        total: parseInt(result.rows[0].total, 10),
        pendientes: parseInt(result.rows[0].pendientes, 10),
        en_curso: parseInt(result.rows[0].en_curso, 10),
        resueltas: parseInt(result.rows[0].resueltas, 10),
      };
    } catch (error) {
      console.error("Error en countComandas:", error.message);
      throw error;
    }
  }



  static async getRecetasProductosStats() {
    try {
      // Obtener total de productos
      const totalProductosResult = await pool.query(`SELECT COUNT(*) AS total_productos FROM productos`);
      const totalProductos = parseInt(totalProductosResult.rows[0].total_productos, 10);

      // Obtener total de recetas
      const totalRecetasResult = await pool.query(`SELECT COUNT(*) AS total_recetas FROM recetas`);
      const totalRecetas = parseInt(totalRecetasResult.rows[0].total_recetas, 10);

      // Obtener número de productos con recetas
      const productosConRecetaResult = await pool.query(`
        SELECT COUNT(DISTINCT producto_id) AS productos_con_receta FROM recetas
      `);
      const productosConReceta = parseInt(productosConRecetaResult.rows[0].productos_con_receta, 10);

      // Calcular productos sin receta
      const productosSinReceta = totalProductos - productosConReceta;

      return {
        totalProductos,
        totalRecetas,
        productosConReceta,
        productosSinReceta,
      };
    } catch (error) {
      console.error("Error en getRecetasProductosStats:", error.message);
      throw error;
    }
  }

    
}

module.exports = Cocina;

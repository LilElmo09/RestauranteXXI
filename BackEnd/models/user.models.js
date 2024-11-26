const pool = require("../db");
const bcrypt = require("bcrypt");
const now = new Date();
const axios = require('axios'); 


class User {

    
  static async register(
    nombre,
    email,
    contraseña,
    creado_en,
    actualizado_en,
    activo,
    apellido
  ) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN"); // Iniciar la transacción

      // Insertar en la tabla 'usuarios' y obtener el id del usuario recién creado
      const userResult = await client.query(
        `INSERT INTO usuarios (nombre, email, contraseña, creado_en, actualizado_en, activo, apellido) 
                 VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`, // Cambié aquí los placeholders
        [nombre, email, contraseña, now, now, true, apellido] // Pasamos los valores correctamente
      );
      const userId = userResult.rows[0].id;

      // Insertar en la tabla 'usuario_roles' usando el id del usuario y rol_id = 5
      await client.query(
        `INSERT INTO usuario_roles (usuario_id, rol_id) VALUES ($1, $2)`,
        [userId, 5]
      );

      await client.query("COMMIT"); // Confirmar la transacción

      return userResult.rows[0];
    } catch (error) {
      await client.query("ROLLBACK"); // Deshacer la transacción en caso de error
      console.error("Error al registrar usuario: ", error.message);
      throw error;
    } finally {
      client.release(); // Liberar el cliente
    }
  }

  // User.js (Modelo)
  static async findByEmail(email) {
    if (!email) {
      throw new Error("El email es requerido");
    }
    try {
      const result = await pool.query(
        `
            SELECT u.id, u.nombre, u.email as email, u.apellido as apellido, u.contraseña, r.nombre AS rol 
            FROM usuarios u 
            LEFT JOIN usuario_roles ur ON u.id = ur.usuario_id 
            LEFT JOIN roles r ON ur.rol_id = r.id 
            WHERE u.email = $1`,
        [email]
      );

      if (result.rows.length === 0) {
        return null; // Si no hay coincidencias, retorna null
      }

      const usuario = result.rows[0];
      usuario.roles = result.rows.map((row) => row.rol); // Obtiene todos los roles en un array
      return usuario;
    } catch (error) {
      console.error("Error en findByEmail: ", error.message);
      throw error;
    }
  }

  // Método para obtener roles de un usuario por su ID
  static async getRolesByUserId(id) {
    try {
      const result = await pool.query(
        `
                SELECT r.nombre AS rol 
                FROM usuario_roles ur 
                INNER JOIN roles r ON ur.rol_id = r.id 
                WHERE ur.usuario_id = $1`,
        [id]
      );

      console.log("Roles obtenidos:", result.rows); // Agrega un log para verificar
      return result.rows; // Debe devolver un array de objetos
    } catch (error) {
      console.error("Error en getRolesByUserId: ", error.message);
      throw error;
    }
  }

  static async getUser(id) {
    try {
      const result = await pool.query(
        `SELECT DISTINCT u.id, u.contraseña, u.nombre, u.email, u.apellido, u.activo, u.creado_en, u.actualizado_en
                 FROM usuarios u
                 LEFT JOIN usuario_roles ur ON u.id = ur.usuario_id
                 LEFT JOIN roles r ON ur.rol_id = r.id
                 WHERE u.id = $1`,
        [id]
      );
      return result.rows[0];
    } catch (error) {
      console.error("Error al obtener el usuario: ", error.message);
      throw error;
    }
  }

  static async addTicket(usuario_id, mensaje) {
    const estado_id = 1;
    const client = await pool.connect();
    try {
      const now = new Date();
      await client.query("BEGIN"); // Iniciar la transacción

      // Insertar en la tabla 'soporte' y obtener el id del usuario recién creado
      const userResult = await client.query(
        `INSERT INTO soporte (usuario_id, mensaje, creado_en) 
                 VALUES ($1, $2, $3) RETURNING id`, //
        [usuario_id, mensaje, now]
      );
      const supportId = userResult.rows[0].id;

      await client.query(
        `INSERT INTO respuestas_soporte (soporte_id, administrador_id, mensaje_respuesta, respondido_en, estado_id) VALUES ($1, $2, $3, $4, $5)`,
        [supportId, null, null, null, estado_id]
      );

      await client.query("COMMIT"); // Confirmar la transacción

      return userResult.rows[0];
    } catch (error) {
      await client.query("ROLLBACK"); // Deshacer la transacción en caso de error
      console.error("Error al registrar usuario: ", error.message);
      throw error;
    } finally {
      client.release(); // Liberar el cliente
    }
  }

  static async getTickets(id) {
    try {
      const result = await pool.query(
        `SELECT 
    rs.soporte_id AS id,
    s.mensaje AS asunto,
    s.creado_en AS fecha_creacion,
    e.nombre AS estado,
    u.nombre AS asignado,
    creador.nombre AS creador_ticket,  -- Nombre del usuario que creó el ticket
    rs.mensaje_respuesta
	
FROM 
    respuestas_soporte AS rs
INNER JOIN 
    soporte AS s ON s.id = rs.soporte_id
INNER JOIN 
    estados AS e ON e.id = rs.estado_id
LEFT JOIN 
    usuarios AS u ON rs.administrador_id = u.id
left JOIN 
    usuarios AS creador ON s.usuario_id = creador.id WHERE s.usuario_id =$1 ORDER BY fecha_creacion  DESC`,
        [id]
      );
      return result.rows;
    } catch (error) {
      console.error("Error al obtener el usuario: ", error.message);
      throw error;
    }
  }

  static async deleteTicket(id) {
    try {
      const result = await pool.query(`DELETE FROM soporte WHERE id = $1`, [
        id,
      ]);
      return result.rowCount;
    } catch (error) {
      console.error("Error al eliminar el ticket: ", error.message);
      throw error;
    }
  }

  static async updateTicket(id, mensaje) {
    try {
      const result = await pool.query(
        `UPDATE soporte SET mensaje = $1 WHERE id = $2`,
        [mensaje, id]
      );
      return result.rowCount;
    } catch (error) {
      console.error("Error al actualizar el ticket: ", error.message);
      throw error;
    }
  }

  static async getCategories() {
    try {
      const result = await pool.query(
        `SELECT DISTINCT categoria FROM productos`
      );
      return result.rows;
    } catch (error) {
      console.error("Error al obtener las categorías: ", error.message);
      throw error;
    }
  }

  static async addCart(usuario_id, producto_id, cantidad) {

    const client = await pool.connect();
    try {
        // 1. Verificar que el usuario tiene una reserva activa (estado_id = 5 o 6)
        const reservaResult = await client.query(
            `SELECT * FROM reservas WHERE usuario_id = $1 AND estado_id IN (5, 6)`,
            [usuario_id]
        );

        // if (reservaResult.rows.length === 0) {
        //     throw new Error('No tienes una mesa asignada. Por favor, asigna una mesa antes de agregar productos al carrito.');
        // }

        const reserva = reservaResult.rows[0];

        // 2. Verificar si el producto ya está en el carrito
        const cartItemResult = await client.query(
            `SELECT * FROM carrito_compras WHERE usuario_id = $1 AND producto_id = $2`,
            [usuario_id, producto_id]
        );

        if (cartItemResult.rows.length > 0) {
            // Actualizar la cantidad del producto en el carrito
            await client.query(
                `UPDATE carrito_compras SET cantidad = cantidad + $1 WHERE usuario_id = $2 AND producto_id = $3`,
                [cantidad, usuario_id, producto_id]
            );
        } else {
            // Insertar un nuevo ítem en el carrito
            await client.query(
                `INSERT INTO carrito_compras (usuario_id, producto_id, cantidad) VALUES ($1, $2, $3)`,
                [usuario_id, producto_id, cantidad]
            );
        }

        return { message: 'Producto agregado al carrito' };
    } catch (error) {
        console.error("Error al agregar al carrito:", error.message);
        throw error;
    } finally {
        client.release();
    }
}


  // models/User.js

static async getCart(user_id) {
    try {
        const result = await pool.query(`
            SELECT 
                c.producto_id,
                p.nombre,
                p.descripcion,
                p.precio,
                p.categoria,
                p.estado_id,
                p.imagen_url,
                c.cantidad,
                (p.precio * c.cantidad) AS precio_total
            FROM 
                carrito_compras c
            JOIN 
                productos p ON c.producto_id = p.id
            WHERE 
                c.usuario_id = $1
        `, [user_id]);

        return result.rows;
    } catch (error) {
        console.error("Error al obtener el carrito: ", error.message);
        throw error;
    }
}


static async deleteCartItem(user_id, producto_id) {
    try {
        const result = await pool.query(
            `DELETE FROM carrito_compras WHERE usuario_id = $1 AND producto_id = $2`,
            [user_id, producto_id]
        );
        return result.rowCount;
    } catch (error) {
        console.error("Error al eliminar el producto del carrito: ", error.message);
        throw error;
    }
}


static async getCurrentReservation(usuario_id) {
    try {
        const result = await pool.query(
            `SELECT r.*, m.numero, m.ubicacion, m.capacidad 
             FROM reservas r
             JOIN mesas m ON r.mesa_id = m.id
             WHERE r.usuario_id = $1 AND r.estado_id IN (5, 6)`, // 5: Reservada, 6: Ocupada
            [usuario_id]
        );

        return result.rows;
    } catch (error) {
        console.error("Error al obtener reservas:", error.message);
        throw error;
    }
}

// Reservar una mesa
static async reserveTable(usuario_id, mesa_id) {
    const client = await pool.connect(); // Obtener una conexión específica
    try {
        await client.query('BEGIN');

        // 1. Verificar si el usuario ya tiene una reserva activa (estado_id = 5 o 6)
        const existingReservaResult = await client.query(
            `SELECT * FROM reservas WHERE usuario_id = $1 AND estado_id IN (5, 6) FOR UPDATE`,
            [usuario_id]
        );

        if (existingReservaResult.rows.length > 0) {
            const existingReserva = existingReservaResult.rows[0];
            
            // 2. Actualizar el estado de la mesa anterior a Disponible (4)
            await client.query(
                `UPDATE mesas SET estado_id = 4 WHERE id = $1`,
                [existingReserva.mesa_id]
            );
            console.log(`Mesa ${existingReserva.mesa_id} actualizada a disponible (4)`);

            // 3. Eliminar la reserva anterior
            await client.query(
                `DELETE FROM reservas WHERE id = $1`,
                [existingReserva.id]
            );
            console.log(`Reserva ${existingReserva.id} eliminada`);
        }

        // 4. Verificar si la nueva mesa está disponible
        const mesaResult = await client.query(
            `SELECT estado_id FROM mesas WHERE id = $1 FOR UPDATE`,
            [mesa_id]
        );

        if (mesaResult.rows.length === 0) {
            await client.query('ROLLBACK');
            throw new Error('Mesa no encontrada');
        }

        const estado_id = mesaResult.rows[0].estado_id;

        if (estado_id !== 4) { // 4: Disponible
            await client.query('ROLLBACK');
            throw new Error('La mesa no está disponible');
        }

        // 5. Actualizar el estado de la mesa a Reservada (5)
        await client.query(
            `UPDATE mesas SET estado_id = 5 WHERE id = $1`,
            [mesa_id]
        );

        // 6. Crear una nueva reserva
        const reservaResult = await client.query(
            `INSERT INTO reservas (usuario_id, mesa_id, estado_id, fecha_reserva)
            VALUES ($1, $2, 5, NOW())
            RETURNING *`,
            [usuario_id, mesa_id]
        );

        await client.query('COMMIT');
        console.log('Mesa reservada exitosamente');
        return reservaResult.rows[0];
    } catch (error) {
        await client.query('ROLLBACK');
        console.error("Error al reservar mesa:", error.message);
        throw error;
    } finally {
        client.release(); // Liberar la conexión de vuelta al pool
    }
}

 /**
     * Confirmar la compra de un usuario.
     * @param {number} usuario_id - ID del usuario.
     * @param {number} total - Total de la compra.
     * @param {Array} cartItems - Array de items en el carrito.
     * @param {number} transaccion_finanzas_id - ID de la transacción financiera.
     * @returns {object} - Objeto con mensaje de éxito y compra_id.
     */

    static async confirmPurchase(usuario_id, total, cartItems, transaccion_finanzas_id) {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            console.log('Transacción iniciada');

            // Validar que cartItems sea un arreglo y tenga elementos
            if (!Array.isArray(cartItems) || cartItems.length === 0) {
                throw new Error('El carrito de compras está vacío o es inválido.');
            }

            // Log para verificar los datos recibidos
            console.log('Contenido de cartItems:', cartItems);

            // Obtener la mesa asignada al usuario
            const mesa_id = await User.getAssignedTable(usuario_id, client);
            console.log('Mesa asignada al usuario:', mesa_id);

            if (!mesa_id) {
                throw new Error('No hay una mesa asignada al usuario.');
            }

            // 2. Insertar la compra en 'compras' con el 'transaccion_finanzas_id' y 'mesa_id'
            const compraResult = await client.query(
                `INSERT INTO compras (usuario_id, mesa_id, total, estado_id, fecha_compra, tiempo_preparacion, transaccion_finanzas_id)
                VALUES ($1, $2, $3, 1, NOW(), NULL, $4) RETURNING *`,
                [usuario_id, mesa_id, total, transaccion_finanzas_id]
            );
            console.log('Compra insertada:', compraResult.rows);

            if (compraResult.rows.length === 0) {
                throw new Error('Error al insertar la compra.');
            }

            const compra = compraResult.rows[0];
            console.log('Compra ID:', compra.id);

            // 3. Insertar los productos en 'compras_productos'
            for (const item of cartItems) {
                console.log('Procesando item:', item);

                // Validar campos individuales y proporcionar mensajes específicos
                const missingFields = [];
                console.log('producto_id:', item.producto_id);
                console.log('cantidad:', item.cantidad);
                console.log('precio_unitario:', item.precio_unitario);
                console.log('precio_total:', item.precio_total);
                if (item.producto_id === undefined) missingFields.push('producto_id');
                if (item.cantidad === undefined) missingFields.push('cantidad');
                if (item.precio_unitario === undefined) missingFields.push('precio_unitario');
                if (item.precio_total === undefined) missingFields.push('precio_total');

                if (missingFields.length > 0) {
                    throw new Error(`Datos de producto incompletos para el producto ID ${item.producto_id}: ${missingFields.join(', ')}`);
                }

                // Convertir valores a números
                const producto_id = Number(item.producto_id);
                const cantidad = Number(item.cantidad);
                const precio_unitario = Number(item.precio_unitario);
                const precio_total = Number(item.precio_total);

                // Validar después de la conversión
                if (
                    isNaN(producto_id) ||
                    isNaN(cantidad) ||
                    isNaN(precio_unitario) ||
                    isNaN(precio_total)
                ) {
                    throw new Error(`Datos de producto inválidos para el producto ID ${item.producto_id}`);
                }

                // Insertar en compras_productos
                await client.query(
                    `INSERT INTO compras_productos (compra_id, producto_id, cantidad, precio_unitario, precio_total)
                    VALUES ($1, $2, $3, $4, $5)`,
                    [compra.id, producto_id, cantidad, precio_unitario, precio_total]
                );
                console.log(`Producto ${producto_id} insertado en compras_productos`);
            }

            // 4. Limpiar el carrito del usuario
            await client.query(
                `DELETE FROM carrito_compras WHERE usuario_id = $1`,
                [usuario_id]
            );
            console.log(`Carrito del usuario ${usuario_id} limpiado`);

            await client.query('COMMIT');
            console.log('Transacción confirmada');
            return { message: 'Compra confirmada exitosamente', compra_id: compra.id };
        } catch (error) {
            await client.query('ROLLBACK');
            console.error("Error al confirmar compra:", error);
            throw error;
        } finally {
            client.release(); // Liberar la conexión de vuelta al pool
        }
    }

// Método para actualizar el tiempo de preparación y estado de las comandas
static async updateComanda(comanda_id, tiempo_preparacion, estado_id) {
    try {
        await pool.query('BEGIN');

        // Verificar que la comanda existe
        const comandaResult = await pool.query(
            `SELECT * FROM comandas WHERE id = $1 FOR UPDATE`,
            [comanda_id]
        );

        if (comandaResult.rows.length === 0) {
            await pool.query('ROLLBACK');
            throw new Error('Comanda no encontrada');
        }

        // Actualizar el tiempo de preparación y estado
        await pool.query(
            `UPDATE comandas SET tiempo_preparacion = $1, estado_id = $2, fecha_comanda = NOW() WHERE id = $3`,
            [tiempo_preparacion, estado_id, comanda_id]
        );

        await pool.query('COMMIT');
        return { message: 'Comanda actualizada exitosamente' };
    } catch (error) {
        await pool.query('ROLLBACK');
        console.error("Error al actualizar comanda:", error.message);
        throw error;
    }
}


static async unassignTable(usuario_id) {
    const client = await pool.connect(); // Obtener una conexión específica
    try {
        await client.query('BEGIN');

        // Obtener la reserva pendiente
        const reservaResult = await client.query(
            `SELECT * FROM reservas WHERE usuario_id = $1 AND estado_id IN (5, 6) FOR UPDATE`, // 5: Reservada, 6: Ocupada
            [usuario_id]
        );

        if (reservaResult.rows.length === 0) {
            await client.query('ROLLBACK');
            throw new Error('No hay una reserva pendiente para este usuario');
        }

        const reserva = reservaResult.rows[0];

        // Actualizar el estado de la mesa a Disponible (4)
        await client.query(
            `UPDATE mesas SET estado_id = 4 WHERE id = $1`,
            [reserva.mesa_id]
        );
        console.log(`Mesa ${reserva.mesa_id} actualizada a disponible (4)`);

        // Eliminar la reserva
        await client.query(
            `DELETE FROM reservas WHERE id = $1`,
            [reserva.id]
        );
        console.log(`Reserva ${reserva.id} eliminada`);

        await client.query('COMMIT');
        console.log('Mesa desocupada exitosamente');
        return { message: 'Mesa desocupada exitosamente' };
    } catch (error) {
        await client.query('ROLLBACK');
        console.error("Error al desocupar mesa:", error.message);
        throw error;
    } finally {
        client.release(); // Liberar la conexión de vuelta al pool
    }
}


 // Obtener las compras del usuario
 static async getCompras(usuario_id) {
    try {
        const result = await pool.query(
            `SELECT 
                c.id, 
                c.fecha_compra, 
                m.numero, 
                m.ubicacion, 
                c.total, 
                c.estado_id,
                json_agg(
                    json_build_object(
                        'id', cp.producto_id,
                        'nombre', p.nombre,
                        'cantidad', cp.cantidad,
                        'precio_total', cp.precio_total
                    )
                ) AS productos
            FROM compras c
            JOIN mesas m ON c.mesa_id = m.id
            JOIN compras_productos cp ON c.id = cp.compra_id
            JOIN productos p ON cp.producto_id = p.id
            WHERE c.usuario_id = $1
            GROUP BY c.id, m.numero, m.ubicacion
            ORDER BY c.fecha_compra DESC`,
            [usuario_id]
        );

        return result.rows;
    } catch (error) {
        console.error("Error al obtener compras:", error.message);
        throw error;
    }
}


static async confirmPurchase(usuario_id, total, cartItems) {
  const client = await pool.connect(); // Obtener una conexión específica
  try {
      await client.query('BEGIN');
      console.log('Transacción iniciada');

      // 1. Obtener la reserva pendiente (estado_id = 5 o 6)
      const reservaResult = await client.query(
          `SELECT * FROM reservas WHERE usuario_id = $1 AND estado_id IN (5, 6) FOR UPDATE`, // 5: Reservada, 6: Ocupada
          [usuario_id]
      );
      console.log('Reserva obtenida:', reservaResult.rows);

      if (reservaResult.rows.length === 0) {
          await client.query('ROLLBACK');
          console.error('No hay una reserva pendiente para este usuario');
          throw new Error('No hay una reserva pendiente para este usuario');
      }

      const reserva = reservaResult.rows[0];

      // 2. Actualizar el estado de la reserva a Ocupada (6) si estaba reservada (5)
      if (reserva.estado_id === 5) {
          await client.query(
              `UPDATE reservas SET estado_id = 6 WHERE id = $1`,
              [reserva.id]
          );
          console.log(`Reserva ${reserva.id} actualizada a estado_id = 6`);
      }

      // 3. Registrar la compra en 'compras' con tiempo_preparacion NULL inicialmente
      const compraResult = await client.query(
          `INSERT INTO compras (usuario_id, mesa_id, total, estado_id, fecha_compra, tiempo_preparacion)
          VALUES ($1, $2, $3, 1, NOW(), NULL) RETURNING *`, // estado_id=1: Pendiente
          [usuario_id, reserva.mesa_id, total]
      );
      console.log('Compra insertada:', compraResult.rows);

      if (compraResult.rows.length === 0) {
          throw new Error('Error al insertar la compra');
      }

      const compra = compraResult.rows[0];
      console.log('Compra ID:', compra.id);

      if (!compra.id) {
          throw new Error('La compra insertada no tiene un ID válido');
      }

      // 4. Registrar los productos en 'compras_productos' y en 'comandas'
      for (const item of cartItems) {
        console.log('Procesando item:', item);
          // Validar que todos los campos necesarios estén presentes
          if (!item.producto_id || !item.cantidad || !item.precio || !item.precio_total) {
              throw new Error('Datos de producto incompletos');
          }

          // Opcional: Verificar que el producto existe
          const productoResult = await client.query(
              `SELECT * FROM productos WHERE id = $1`,
              [item.producto_id]
          );

          if (productoResult.rows.length === 0) {
              throw new Error(`El producto con ID ${item.producto_id} no existe`);
          }

          console.log(`Insertando producto_id: ${item.producto_id}, cantidad: ${item.cantidad}, precio_unitario: ${item.precio}, precio_total: ${item.precio_total}`);

          // Insertar en compras_productos
          await client.query(
              `INSERT INTO compras_productos (compra_id, producto_id, cantidad, precio_unitario, precio_total)
              VALUES ($1, $2, $3, $4, $5)`,
              [compra.id, item.producto_id, item.cantidad, item.precio, item.precio_total]
          );
          console.log(`Producto ${item.producto_id} insertado en compras_productos`);

          // Insertar en comandas con estado_id=1 (Pendiente)
          await client.query(
              `INSERT INTO comandas (compra_id, producto_id, cantidad, tiempo_preparacion, estado_id, fecha_comanda)
              VALUES ($1, $2, $3, NULL, 1, NOW())`,
              [compra.id, item.producto_id, item.cantidad]
          );
          console.log(`Comanda para producto ${item.producto_id} insertada`);
      }

      // 5. Limpiar el carrito del usuario
      await client.query(
          `DELETE FROM carrito_compras WHERE usuario_id = $1`,
          [usuario_id]
      );
      console.log(`Carrito del usuario ${usuario_id} limpiado`);

      await client.query('COMMIT');
      console.log('Transacción confirmada');
      return { message: 'Compra confirmada exitosamente', compra_id: compra.id };
  } catch (error) {
      await client.query('ROLLBACK');
      console.error("Error al confirmar compra:", error.message);
      throw error;
  } finally {
      client.release(); // Liberar la conexión de vuelta al pool
  }
}


    // Obtener pedidos pendientes y en curso para un cliente
    static async getPedidos(usuario_id) {
      try {
          const result = await pool.query(
              `SELECT 
                  c.id AS comanda_id,
                  p.nombre AS producto_nombre,
                  cp.cantidad,
                  compra.tiempo_preparacion,
                  e.nombre AS estado,
                  c.fecha_comanda,
                  compra.total,
                  compra.fecha_compra
              FROM comandas c
              JOIN compras_productos cp ON c.compra_id = cp.compra_id AND c.producto_id = cp.producto_id
              JOIN productos p ON cp.producto_id = p.id
              JOIN estados e ON c.estado_id = e.id
              JOIN compras compra ON c.compra_id = compra.id
              WHERE compra.usuario_id = $1 AND compra.estado_id IN (1, 2)
              ORDER BY compra.fecha_compra DESC`,
              [usuario_id]
          );

          return result.rows;
      } catch (error) {
          console.error("Error al obtener pedidos:", error.message);
          throw error;
      }
  }
}

module.exports = User;

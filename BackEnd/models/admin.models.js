const pool = require("../db");
const bcrypt = require('bcryptjs');
class Admin {
  static async registerAdmin(
    nombre,
    email,
    contraseña,
    creado_en,
    actualizado_en,
    activo,
    rol_id,
    apellido
  ) {
    const client = await pool.connect();
    const now = new Date();
    try {
      await client.query("BEGIN"); // Iniciar la transacción

      // Insertar en la tabla 'usuarios' y obtener el id del usuario recién creado
      const userResult = await client.query(
        `INSERT INTO usuarios (nombre, email, contraseña, creado_en, actualizado_en, activo, apellido) 
                 VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
        [nombre, email, contraseña, now, now, activo, apellido]
      );
      const userId = userResult.rows[0].id;

      // Insertar en la tabla 'usuario_roles' usando el id del usuario y el rol_id proporcionado
      await client.query(
        `INSERT INTO usuario_roles (usuario_id, rol_id) VALUES ($1, $2)`,
        [userId, rol_id]
      );

      await client.query("COMMIT"); // Confirmar la transacción

      return userResult.rows[0];
    } catch (error) {
      await client.query("ROLLBACK"); // Deshacer la transacción en caso de error
      console.error(
        "Error al registrar usuario como administrador: ",
        error.message
      );
      throw error;
    } finally {
      client.release(); // Liberar el cliente
    }
  }

  static async getCountUsers() {
    const client = await pool.connect();
    try {
      const result = await client.query(`
                SELECT 
                    COUNT(*) AS total,
                    COUNT(CASE WHEN activo = true THEN 1 END) AS activos,
                    COUNT(CASE WHEN activo = false THEN 1 END) AS inactivos
                FROM usuarios
            `);

      return result.rows[0]; // Retorna un objeto con total, activos e inactivos
    } catch (error) {
      console.error(
        "Error al obtener los conteos de usuarios: ",
        error.message
      );
      throw error;
    } finally {
      client.release();
    }
  }

  static async getRoles() {
    const client = await pool.connect();
    try {
      const result = await client.query(`
                SELECT id, nombre
                FROM roles;
            `);
      return result.rows;
    } catch (error) {
      console.error("Error al obtener los roles: ", error.message);
      throw error;
    } finally {
      client.release();
    }
  }

  static async getUsers() {
    const client = await pool.connect();
    try {
      const result = await client.query(`
                SELECT 
  u.id, 
  u.nombre, 
  u.email, 
  u.apellido, 
  u.activo, 
  r.id AS role_id, 
  r.nombre AS rol,
  u.creado_en,
  u.actualizado_en
FROM usuarios u
LEFT JOIN usuario_roles ur ON u.id = ur.usuario_id
LEFT JOIN roles r ON ur.rol_id = r.id
ORDER BY u.id DESC;

            `);
      return result.rows;
    } catch (error) {
      console.error("Error al obtener los usuarios: ", error.message);
      throw error;
    } finally {
      client.release();
    }
  }

  static async updateUser(id, activo) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `
                UPDATE usuarios
                SET activo = $1, actualizado_en = $2 
                WHERE id = $3
                RETURNING activo
            `,
        [activo, new Date(), id]
      );
      return result.rows[0];
    } catch (error) {
      console.error("Error al actualizar usuario: ", error.message);
      throw error;
    } finally {
      client.release();
    }
  }

  static async deleteBarge(usuario_id, rol_id) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `DELETE FROM usuario_roles WHERE usuario_id = $1 AND rol_id = $2 RETURNING *;`,
        [usuario_id, rol_id]
      );
      return result.rows[0]; // Debe devolver un array de objetos
    } catch (error) {
      console.error("Error al eliminar la etiqueta de rol: ", error.message);

      throw error;
    } finally {
      client.release(); // Liberar el cliente
    }
  }

  static async addRole(usuario_id, rol_id) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `INSERT INTO usuario_roles (usuario_id, rol_id) VALUES ($1, $2) RETURNING *;`,
        [usuario_id, rol_id]
      );
      return result.rows[0]; // Debe devolver un array de objetos
    } catch (error) {
      console.error("Error al agregar el rol: ", error.message);
      throw error;
    } finally {
      client.release(); // Liberar el cliente
    }
  }

  static async deleteUser(id) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `DELETE FROM usuarios WHERE id = $1 RETURNING *;`,
        [id]
      );
      return result.rows[0]; // Debe devolver un array de objetos
    } catch (error) {
      console.error("Error al eliminar el usuario: ", error.message);
      throw error;
    } finally {
      client.release(); // Liberar el cliente
    }
  }



  static async updateUserFromAdmin(id, fieldsToUpdate) {
    const client = await pool.connect();
    try {
      const fieldNames = [];
      const values = [];
      let index = 1;
  
      for (const [key, value] of Object.entries(fieldsToUpdate)) {
        if (key === 'contraseña') {
          // Verificar si la contraseña necesita ser hasheada
          if (!value.startsWith("$2a$")) {
            const hashedPassword = await bcrypt.hash(value, 10);
            fieldNames.push(`contraseña = $${index}`);
            values.push(hashedPassword);
          } else {
            // Contraseña ya está hasheada, no la rehasheamos
            fieldNames.push(`contraseña = $${index}`);
            values.push(value);
          }
        } else {
          fieldNames.push(`${key} = $${index}`);
          values.push(value);
        }
        index++;
      }
  
      values.push(id); // Añadir el ID al final para la cláusula WHERE
      const query = `
        UPDATE usuarios
        SET ${fieldNames.join(', ')}, actualizado_en = NOW()
        WHERE id = $${index}
        RETURNING *;
      `;
  
      const result = await client.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error("Error al actualizar usuario desde admin: ", error.message);
      throw error;
    } finally {
      client.release();
    }
  }

  static async getTicketsAdmin() {
    const client = await pool.connect();
    try {
      const result = await client.query(`
                SELECT 
    rs.soporte_id AS id,
    creador.email as email,
    s.mensaje AS asunto,
    s.creado_en AS fecha_creacion,
    e.nombre AS estado,
    u.nombre AS asignado,
    creador.nombre AS creador_ticket,
    rs.mensaje_respuesta,
	rs.administrador_id AS administrador_id
	
FROM 
    respuestas_soporte AS rs
INNER JOIN 
    soporte AS s ON s.id = rs.soporte_id
INNER JOIN 
    estados AS e ON e.id = rs.estado_id
LEFT JOIN 
    usuarios AS u ON rs.administrador_id = u.id
left JOIN 
    usuarios AS creador ON s.usuario_id = creador.id ORDER BY fecha_creacion  DESC
            `);
      return result.rows;
    } catch (error) {
      console.error("Error al obtener los tickets de atención: ", error.message);
      throw error;
    } finally {
      client.release();
    }
  }
  static async takeTicketAdmin(id, administrador_id) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const result = await client.query(
        `UPDATE respuestas_soporte SET administrador_id = $1, estado_id = $2 WHERE id = $3`,
        [administrador_id, 2, id]
      );
      await client.query('COMMIT');
      return result.rowCount;
    } catch (error) {
      await client.query('ROLLBACK');
      console.error("Error al actualizar el ticket: ", error.message);
      throw error;
    } finally {
      client.release();
    }
  }

  static async closeTicketAdmin(id, mensaje_respuesta) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const result = await client.query(
        `UPDATE respuestas_soporte SET estado_id = $1, mensaje_respuesta = $2 WHERE id = $3`,
        [3, mensaje_respuesta, id]
      );
      await client.query('COMMIT');
      return result.rowCount;
    } catch (error) {
      await client.query('ROLLBACK');
      console.error("Error al cerrar el ticket: ", error.message);
      throw error;
    } finally {
      client.release();
    }
  }

  static async getCountIssues(){
    const client = await pool.connect();
    try {
      const result = await client.query(`
                SELECT 
                    COUNT(*) AS total,
                    COUNT(CASE WHEN estado_id = 1 THEN 1 END) AS pendientes,
                    COUNT(CASE WHEN estado_id = 2 THEN 1 END) AS en_proceso,
                    COUNT(CASE WHEN estado_id = 3 THEN 1 END) AS resueltos
                FROM respuestas_soporte
            `);

      return result.rows[0]; // Retorna un objeto con total, activos e inactivos
    } catch (error) {
      console.error(
        "Error al obtener los conteos de tickets: ", error.message
      );
      throw error;
    } finally {
      client.release();
    }
  }

  // Modelo Admin.js
static async addTable(numero, estado_id, ubicacion, capacidad) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `INSERT INTO mesas (numero, estado_id, ubicacion, capacidad) VALUES ($1, $2, $3, $4) RETURNING *;`,
      [numero, estado_id, ubicacion, capacidad]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error al agregar la mesa: ", error.message);
    throw error;
  } finally {
    client.release();
  }
}


  static async getTables() {
    const client = await pool.connect();
    try {
      const result = await client.query(`
                SELECT 
                    m.id,
                    m.numero,
                    m.estado_id,
                    e.nombre AS estado,
                    m.ubicacion,
                    m.capacidad
                FROM mesas m
                INNER JOIN estados e ON m.estado_id = e.id ORDER BY m.numero ASC
            `);
      return result.rows;
    } catch (error) {
      console.error("Error al obtener las mesas: ", error.message);
      throw error;
    } finally {
      client.release();
    }
  }

  static async updateTable(id, numero, estado_id, ubicacion, capacidad) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `UPDATE mesas SET numero = $1, estado_id = $2, ubicacion = $3, capacidad = $4 WHERE id = $5 RETURNING *;`,
        [numero, estado_id, ubicacion, capacidad, id]
      );
      return result.rows[0]; // Debe devolver un array de objetos
    } catch (error) {
      console.error("Error al actualizar la mesa: ", error.message);
      throw error;
    } finally {
      client.release(); // Liberar el cliente
    }
  }

  static async deleteTable(id) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `DELETE FROM mesas WHERE id = $1 RETURNING *;`,
        [id]
      );
      return result.rows[0]; // Debe devolver un array de objetos
    } catch (error) {
      console.error("Error al eliminar la mesa: ", error.message);
      throw error;
    } finally {
      client.release(); // Liberar el cliente
    }
  }


  static async getCountTables() {
    const client = await pool.connect();
    try {
      const result = await client.query(`
        SELECT 
            COUNT(*) AS total,
            COUNT(CASE WHEN estado_id = 4 THEN 1 END) AS disponibles,
            COUNT(CASE WHEN estado_id = 5 THEN 1 END) AS reservadas,
            COUNT(CASE WHEN estado_id = 6 THEN 1 END) AS ocupadas
        FROM mesas;
      `);
  
      return result.rows[0]; // Retorna un objeto con total, disponibles, reservadas y ocupadas
    } catch (error) {
      console.error("Error al obtener los conteos de mesas: ", error.message);
      throw error;
    } finally {
      client.release();
    }
  }
  
  
  static async getStatusTables() {
    const client = await pool.connect();
    try {
      const result = await client.query(`
                SELECT id, nombre FROM estados;
            `);

      return result.rows; 
    } catch (error) {
      console.error(
        "Error al obtener los conteos de mesas: ", error.message
      );
      throw error;
    } finally {
      client.release();
    }
  } 


   // Obtener Productos
   static async getProducts() {
    const client = await pool.connect();
    try {
        const result = await client.query(`
            SELECT 
                p.id,
                p.nombre,
                p.descripcion,
                p.precio,
                p.categoria,
                p.estado_id,
                p.imagen_url,
                p.creado_en,
                p.actualizado_en
            FROM productos p
            ORDER BY p.id DESC;
        `);
        return result.rows;
    } catch (error) {
        console.error("Error al obtener los productos:", error.message);
        throw error;
    } finally {
        client.release();
    }
}

// Obtener Producto por ID
static async getProductById(id) {
    const client = await pool.connect();
    try {
        const result = await client.query(`
            SELECT * FROM productos WHERE id = $1;
        `, [id]);
        return result.rows[0];
    } catch (error) {
        console.error("Error al obtener el producto por ID:", error.message);
        throw error;
    } finally {
        client.release();
    }
}

// Agregar Producto
static async addProduct(nombre, descripcion, precio, categoria, estado_id, imagen_url) {
    const client = await pool.connect();
    try {
        const result = await client.query(
            `INSERT INTO productos (nombre, descripcion, precio, categoria, estado_id, imagen_url, creado_en, actualizado_en)
             VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
             RETURNING *;`,
            [nombre, descripcion, precio, categoria, estado_id, imagen_url]
        );
        return result.rows[0];
    } catch (error) {
        console.error("Error al agregar el producto: ", error.message);
        throw error;
    } finally {
        client.release();
    }
}

// Actualizar Producto
static async updateProduct(id, nombre, descripcion, precio, categoria, estado_id, imagen_url = null) {
  const client = await pool.connect();
  try {
      // Construir la consulta dinámica
      let query = `
          UPDATE productos
          SET nombre = $1,
              descripcion = $2,
              precio = $3,
              categoria = $4,
              estado_id = $5,
              actualizado_en = NOW()
      `;
      const values = [nombre, descripcion, precio, categoria, estado_id];
      let placeholderId;

      if (imagen_url) {
          query += `, imagen_url = $6`;
          values.push(imagen_url);
          placeholderId = "$7";
      } else {
          placeholderId = "$6";
      }

      query += ` WHERE id = ${placeholderId} RETURNING *;`;
      values.push(id); // Agregar 'id' al final del arreglo de valores

      const result = await client.query(query, values);
      return result.rows[0];
  } catch (error) {
      console.error("Error al actualizar el producto: ", error.message);
      throw error;
  } finally {
      client.release();
  }
}


// Eliminar Producto
static async deleteProduct(id) {
    const client = await pool.connect();
    try {
        await client.query(
            `DELETE FROM productos WHERE id = $1;`,
            [id]
        );
    } catch (error) {
        console.error("Error al eliminar el producto: ", error.message);
        throw error;
    } finally {
        client.release();
    }
}

}

module.exports = Admin;

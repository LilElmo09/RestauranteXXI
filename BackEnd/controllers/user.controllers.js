const User = require("../models/user.models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

class UserController {
  static async register(req, res) {
    const {
      nombre,
      email,
      contraseña,
      creado_en,
      actualizado_en,
      activo,
      apellido,
    } = req.body;
    try {
      const hash = await bcrypt.hash(contraseña, 10);
      const result = await User.register(
        nombre,
        email,
        hash,
        creado_en,
        actualizado_en,
        activo,
        apellido
      );
      return res.status(201).json(result);
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  }
  // Método para iniciar sesión
  // Controlador (ej. AuthController.js)
  static async login(req, res) {
    const { email, contraseña } = req.body;

    

    if (!email || !contraseña) {
      return res
        .status(400)
        .json({ message: "Email y contraseña son requeridos" });
    }

    try {
      const usuario = await User.findByEmail(email);
      if (!usuario) {
        return res.status(400).json({ message: "Usuario no encontrado" });
      }

      const isMatch = await bcrypt.compare(contraseña, usuario.contraseña);
      if (!isMatch) {
        return res.status(400).json({ message: "Contraseña incorrecta" });
      }

      // Genera el token y extrae roles y nombre
      const roles = usuario.roles;
      const nombre = usuario.nombre;
      const apellido = usuario.apellido;
      
      const id = usuario.id;
      const token = jwt.sign(
        { id: usuario.id, roles, nombre, apellido, email },
        process.env.JWT_SECRET,
        {
          expiresIn: "1h",
        }
      );

      // Devuelve el token, roles y nombre del usuario
      return res.status(200).json({ token, roles, nombre, id, apellido, email });
    } catch (error) {
      console.error("Error en login: ", error.message, error);
      return res.status(500).json({ message: error.message });
    }
  }

  static async getRoles(req, res) {
    const { id } = req.params;
    try {
      const roles = await User.getRolesByUserId(id);
      return res.status(200).json(roles);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  static async getUser(req, res) {
    const { id } = req.params;
    try {
      const user = await User.getUser(id);
      return res.status(200).json(user);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  static async getTickets(req, res) {
    const { id } = req.params;
    try {
      const tickets = await User.getTickets(id);
      return res.status(200).json(tickets);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  static async addTicket(req, res) {
    const { usuario_id, mensaje} = req.body;
    try {
      const ticket = await User.addTicket(usuario_id, mensaje);
      return res.status(201).json(ticket);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  static async deleteTicket(req, res) {
    const { id } = req.params;
    try {
      await User.deleteTicket(id);
      return res.status(204).end();
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  static async updateTicket(req, res) {
    const { id } = req.params;
    const { mensaje } = req.body;
    try {
      const ticket = await User.updateTicket(id, mensaje);
      return res.status(200).json(ticket);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  static async getCategories(req, res) {
    try {
      const categories = await User.getCategories();
      return res.status(200).json(categories);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  static async addCart(req, res) {
    const { usuario_id, producto_id, cantidad } = req.body;
    try {
        const cart = await User.addCart(usuario_id, producto_id, cantidad);
        return res.status(201).json({ message: 'Producto agregado al carrito.' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

  static async getCart(req, res) {
    const { id } = req.params;
    try {
      const cart = await User.getCart(id);
      return res.status(200).json(cart);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  static async deleteCartItem(req, res) {
    const { user_id, producto_id } = req.params;
    try {
        const rowCount = await User.deleteCartItem(user_id, producto_id);
        if (rowCount === 0) {
            return res.status(404).json({ message: 'Producto no encontrado en el carrito.' });
        }
        return res.status(200).json({ message: 'Producto eliminado del carrito.' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}



static async getCurrentReservation(req, res) {
  const { usuario_id } = req.params;
  try {
      const reserva = await User.getCurrentReservation(usuario_id);
      if (!reserva) {
          return res.status(404).json({ message: 'No hay reserva actual' });
      }
      return res.status(200).json(reserva);
  } catch (error) {
      return res.status(500).json({ message: error.message });
  }
}

// Reservar una mesa
static async reserveTable(req, res) {
  const { usuario_id, mesa_id } = req.body;
  try {
      const reserva = await User.reserveTable(usuario_id, mesa_id);
      return res.status(201).json({ message: 'Mesa reservada exitosamente', reserva });
  } catch (error) {
      return res.status(400).json({ message: error.message });
  }
}

static async confirmPurchase(req, res) {
  const { usuario_id, total, cartItems, transaccion_finanzas_id } = req.body;

  // Log para depuración
  console.log('Datos recibidos en el backend:', { usuario_id, total, cartItems, transaccion_finanzas_id });

  try {
      if (!transaccion_finanzas_id) {
          throw new Error('ID de transacción financiera faltante.');
      }

      const result = await User.confirmPurchase(usuario_id, total, cartItems, transaccion_finanzas_id);
      return res.status(200).json(result);
  } catch (error) {
      console.error('Error en confirmPurchase:', error);
      return res.status(400).json({ message: error.message });
  }
}

  // Desasignar una mesa
  static async unassignTable(req, res) {
    const { usuario_id } = req.body;
    try {
        const result = await User.unassignTable(usuario_id);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

  // Obtener las compras del usuario
  static async getCompras(req, res) {
    const { usuario_id } = req.params;
    try {
        const compras = await User.getCompras(usuario_id);
        return res.status(200).json(compras);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
}

module.exports = UserController;

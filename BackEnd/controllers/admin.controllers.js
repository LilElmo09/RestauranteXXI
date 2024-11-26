// controllers/admin.controllers.js

const Admin = require("../models/admin.models");
const bcrypt = require("bcryptjs");
const fs = require('fs');
const path = require('path');
const sharp = require('sharp'); // Para optimizar imágenes

class AdminControllers {
    // Métodos existentes...

    static async registerAdmin(req, res) {
        const {
            nombre,
            email,
            contraseña,
            creado_en,
            actualizado_en,
            activo,
            rol_id,
            apellido,
        } = req.body;
        try {
            const hash = await bcrypt.hash(contraseña, 10);
            const result = await Admin.registerAdmin(
                nombre,
                email,
                hash,
                creado_en,
                actualizado_en,
                activo,
                rol_id,
                apellido
            );
            return res.status(201).json(result);
        } catch (error) {
            return res.status(500).json({
                message: error.message,
            });
        }
    }

    static async getCountUsers(req, res) {
        try {
            const result = await Admin.getCountUsers();
            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({
                message: error.message,
            });
        }
    }

    static async getRoles(req, res) {
        try {
            const result = await Admin.getRoles();
            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({
                message: error.message,
            });
        }
    }

    static async getUsers(req, res) {
        try {
            const result = await Admin.getUsers();
            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({
                message: error.message,
            });
        }
    }

    static async updateUser(req, res) {
        const { id } = req.params;
        const { activo } = req.body;
        try {
            const result = await Admin.updateUser(id, activo);
            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({
                message: error.message,
            });
        }
    }

    static async deleteBarge(req, res) {
        const { usuario_id } = req.params;
        const { rol_id } = req.body;
        try {
            const result = await Admin.deleteBarge(usuario_id, rol_id);
            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({
                message: error.message,
            });
        }
    }

    static async addRole(req, res) {
        const { usuario_id } = req.params;
        const { rol_id } = req.body;
        try {
            const result = await Admin.addRole(usuario_id, rol_id);
            return res.status(201).json(result);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    static async deleteUser(req, res) {
        const { id } = req.params;
        try {
            const result = await Admin.deleteUser(id);
            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    static async updateUserFromAdmin(req, res) {
        const { id } = req.params;
        const { nombre, apellido, contraseña } = req.body;
    
        // Construir un objeto solo con los campos a actualizar
        const fieldsToUpdate = { nombre, apellido };
        if (contraseña) fieldsToUpdate.contraseña = contraseña;
    
        try {
            const result = await Admin.updateUserFromAdmin(id, fieldsToUpdate);
            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    static async getTicketsAdmin(req, res) {
        try {
            const result = await Admin.getTicketsAdmin();
            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    static async takeTicketsAdmin(req, res) {
        const { id } = req.params;
        const { administrador_id } = req.body;
        try {
            const result = await Admin.takeTicketAdmin(id, administrador_id);
            return res.status(200).json({ message: "Ticket tomado correctamente." });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    static async closeTicketAdmin(req, res) {
        const { id } = req.params;
        const { mensaje_respuesta } = req.body;
        try {
            const result = await Admin.closeTicketAdmin(id, mensaje_respuesta);
            return res.status(200).json({ message: "Ticket cerrado correctamente." });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    static async getCountIssues(req, res) {
        try {
            const result = await Admin.getCountIssues();
            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    // Métodos relacionados con Mesas...
    static async addTable(req, res) {
        const { numero, estado_id, ubicacion, capacidad } = req.body; 
        try {
            const result = await Admin.addTable(numero, estado_id, ubicacion, capacidad);
            return res.status(201).json(result);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    static async getTables(req, res) {
        try {
            const result = await Admin.getTables();
            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    static async updateTable(req, res) {
        const { id } = req.params;
        const { numero, estado_id, ubicacion, capacidad } = req.body;
        try {
            const result = await Admin.updateTable(id, numero, estado_id, ubicacion, capacidad);
            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    static async deleteTable(req, res) {
        const { id } = req.params;
        try {
            const result = await Admin.deleteTable(id);
            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    static async getCountTables(req, res) {
        try {
            const result = await Admin.getCountTables();
            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
    
    static async getStatusTables(req, res) {
        try {
            const result = await Admin.getStatusTables();
            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

 // Obtener Productos
// controllers/admin.controllers.js

// Función para obtener productos
static async getProducts(req, res) {
    try {
      const productos = await Admin.getProducts();
      // Asegurarse de que 'precio' es un número
      const productosWithNumeros = productos.map(producto => ({
        ...producto,
        precio: parseFloat(producto.precio),
      }));
      res.status(200).json(productosWithNumeros);
    } catch (error) {
      console.error("Error al obtener los productos:", error.message);
      res.status(500).json({ message: "Error al obtener los productos." });
    }
  }
  

static async addProduct(req, res) {
    const { nombre, descripcion, precio, categoria, estado_id } = req.body;
    const imagen = req.file;

    if (!nombre || !descripcion || !precio || !categoria || !estado_id || !imagen) {
        return res.status(400).json({ message: "Todos los campos son obligatorios." });
    }

    try {
        // Ruta para la imagen optimizada
        const optimizedImagePath = path.join(__dirname, '../images', `optimized_${imagen.filename}`);

        // Procesar la imagen con Sharp
        await sharp(imagen.path)
            .resize(800) // Redimensionar a 800px
            .toFormat('jpeg')
            .jpeg({ quality: 80 })
            .toFile(optimizedImagePath);

        // Eliminar la imagen original de forma segura
        try {
            await fs.unlink(imagen.path);
        } catch (err) {
            console.warn("No se pudo eliminar la imagen original:", err.message);
        }

        // Construir la URL de la imagen
        const imagenUrl = `/images/optimized_${imagen.filename}`;

        // Insertar el producto en la base de datos
        const nuevoProducto = await Admin.addProduct(
            nombre,
            descripcion,
            parseFloat(precio),
            categoria,
            parseInt(estado_id),
            imagenUrl
        );

        return res.status(201).json({
            message: "Producto agregado exitosamente.",
            producto: nuevoProducto
        });
    } catch (error) {
        console.error("Error al agregar el producto:", error.message);
        return res.status(500).json({
            message: "Error al agregar el producto: " + error.message,
        });
    }
}
  

static async updateProduct(req, res) {
    const { id } = req.params;
    const { nombre, descripcion, precio, categoria, estado_id } = req.body;
    const imagen = req.file;
  
    if (!nombre || !descripcion || !precio || !categoria || !estado_id) {
      return res.status(400).json({ message: "Todos los campos son obligatorios." });
    }
  
    try {
      // Obtener el producto actual de la base de datos
      const productoActual = await Admin.getProductById(parseInt(id));
      if (!productoActual) {
        return res.status(404).json({ message: "Producto no encontrado." });
      }
  
      // Si se sube una nueva imagen, eliminar las imágenes anteriores
      let imagenUrl = productoActual.imagen_url; // Mantén la imagen actual por defecto
      if (imagen) {
        const oldImagePath = path.join(__dirname, '../', productoActual.imagen_url);
        const optimizedImagePath = path.join(
          __dirname,
          '../images',
          `optimized_${path.basename(productoActual.imagen_url)}`
        );
  
        // Eliminar las imágenes anteriores si existen
        [oldImagePath, optimizedImagePath].forEach((filePath) => {
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        });
  
        // Guardar la nueva imagen
        imagenUrl = `/images/${imagen.filename}`;
      }
  
      // Actualizar el producto en la base de datos
      const updatedProducto = await Admin.updateProduct(
        parseInt(id),
        nombre,
        descripcion,
        parseFloat(precio),
        categoria,
        parseInt(estado_id),
        imagenUrl
      );
  
      return res.status(200).json({
        message: "Producto actualizado exitosamente.",
        producto: updatedProducto,
      });
    } catch (error) {
      console.error("Error al actualizar el producto:", error.message);
      return res.status(500).json({
        message: "Error al actualizar el producto: " + error.message,
      });
    }
  }

// Eliminar Producto
static async deleteProduct(req, res) {
  const { id } = req.params;

  try {
      // Obtener el producto para eliminar la imagen
      const producto = await Admin.getProductById(parseInt(id));
      if (producto && producto.imagen_url) {
          const imagePath = path.join(__dirname, '../', producto.imagen_url);
          if (fs.existsSync(imagePath)) {
              fs.unlinkSync(imagePath);
          }
      }

      // Eliminar el producto de la base de datos
      await Admin.deleteProduct(parseInt(id));

      return res.status(200).json({ message: "Producto eliminado exitosamente." });
  } catch (error) {
      console.error("Error al eliminar el producto:", error.message);
      return res.status(500).json({
          message: "Error al eliminar el producto: " + error.message,
      });
  }
}
}

module.exports = AdminControllers;

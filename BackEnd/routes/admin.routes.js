// routes/admin.routes.js

const { Router } = require('express');
const AdminController = require('../controllers/admin.controllers'); 
const multer = require('multer');
const path = require('path');

const router = Router();

// Configuración de Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../images')); // Ruta a la carpeta 'images'
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); // Nombre único para evitar colisiones
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Solo se permiten imágenes (jpeg, jpg, png, gif)'));
    }
};

const upload = multer({ 
    storage: storage, 
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // Limitar a 5MB
});

// Rutas de Administrador
router.post('/register/', AdminController.registerAdmin); // Administrador registra múltiples roles
router.get('/count-users/', AdminController.getCountUsers); // Contar usuarios
router.get('/count-issues/', AdminController.getCountIssues); // Contar tickets
router.get('/get-roles/', AdminController.getRoles); // Obtener roles
router.get('/get-users/', AdminController.getUsers); // Obtener usuarios
router.put('/update-user/:id', AdminController.updateUser); // Actualizar usuario
router.delete('/delete-barge/:usuario_id', AdminController.deleteBarge); // Eliminar rol de usuario
router.post('/add-role/:usuario_id', AdminController.addRole); // Agregar rol a usuario
router.delete('/delete-user/:id', AdminController.deleteUser); // Eliminar usuario
router.put('/update-user-admin/:id', AdminController.updateUserFromAdmin); // Actualizar usuario desde admin
router.post('/admin/register/', AdminController.registerAdmin); // administrador registra multiples roles

// Soporte
router.get('/get-tickets-admin/', AdminController.getTicketsAdmin); // Obtener tickets de atención
router.put('/take-ticket-admin/:id', AdminController.takeTicketsAdmin); // Actualizar ticket para tomarlo
router.put('/close-ticket-admin/:id', AdminController.closeTicketAdmin); // Actualizar ticket para resolverlo

// Mesas
router.post('/add-table/', AdminController.addTable); // Agregar mesa
router.get('/get-tables/', AdminController.getTables); // Obtener mesas
router.put('/update-table/:id', AdminController.updateTable); // Actualizar mesa
router.delete('/delete-table/:id', AdminController.deleteTable); // Eliminar mesa
router.get('/get-status-tables/', AdminController.getStatusTables); // Obtener estado de mesas
router.get('/count-tables/', AdminController.getCountTables); // Contar mesas

// Productos
router.post('/add-product/', upload.single('imagen'), AdminController.addProduct); // Agregar producto
router.get('/get-products/', AdminController.getProducts); // Obtener productos
router.put('/update-product/:id', upload.single('imagen'), AdminController.updateProduct); // Actualizar producto
router.delete('/delete-product/:id', AdminController.deleteProduct); // Eliminar producto

module.exports = router;

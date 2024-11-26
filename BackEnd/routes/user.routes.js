const { Router } = require('express');
const UserController = require('../controllers/user.controllers');
const router = Router();

// Rutas para registrar un usuario y para iniciar sesión
router.post('/register/', UserController.register); // Registrar un usuario
router.post('/login/', UserController.login); // Iniciar sesión de usuario




router.get('/get-user/:id', UserController.getUser); // Obtener usuario por id

router.get('/user-roles/:id', UserController.getRoles); // Obtener roles de usuario

router.post('/add-ticket/', UserController.addTicket); // Agregar ticket

router.get('/get-tickets/:id', UserController.getTickets); // Obtener ticket    

router.delete('/delete-ticket/:id', UserController.deleteTicket); // Eliminar ticket

router.put('/update-ticket/:id', UserController.updateTicket); // Actualizar ticket

router.get('/get-categories/', UserController.getCategories); // Obtener categorías

//carrito de compras

router.post('/add-cart/', UserController.addCart); // Agregar al carrito

router.get('/get-cart/:id', UserController.getCart); // Obtener carrito por usuario

router.delete('/delete-cart/:user_id/:producto_id', UserController.deleteCartItem); // Eliminar carrito por usuario

//mesas



router.post('/unassign-table/', UserController.unassignTable); 


router.get('/get-reservations/:usuario_id', UserController.getCurrentReservation);
router.post('/reserve-table', UserController.reserveTable);
router.post('/confirm-purchase', UserController.confirmPurchase);
router.get('/get-compras/:usuario_id', UserController.getCompras); // Nueva ruta




module.exports = router;

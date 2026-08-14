const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// ==========================================
// 1. RUTA DE ADMIN (Trae TODO el historial)
// ==========================================
// Al ponerla arriba, evitamos que se confunda con las rutas del usuario
router.get('/all', authMiddleware, cartController.getAllCarts);

// ==========================================
// 2. RUTAS DEL USUARIO (Su propio carrito)
// ==========================================
router.get('/', authMiddleware, cartController.getCart);
router.post('/', authMiddleware, cartController.addToCart);
router.delete('/:productoId', authMiddleware, cartController.removeFromCart);

module.exports = router;
const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

router.use(authMiddleware, roleMiddleware(['user', 'admin']));

router.get('/', cartController.getCart);
router.post('/', cartController.addToCart);
router.delete('/:productoId', cartController.removeFromCart);

module.exports = router;
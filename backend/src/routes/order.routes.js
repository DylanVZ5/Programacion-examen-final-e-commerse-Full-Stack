const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

router.use(authMiddleware);

router.get('/', orderController.getOrders);
router.post('/', roleMiddleware(['user', 'admin']), orderController.createOrder);
router.put('/:id', roleMiddleware(['admin']), orderController.updateOrderStatus);

module.exports = router;
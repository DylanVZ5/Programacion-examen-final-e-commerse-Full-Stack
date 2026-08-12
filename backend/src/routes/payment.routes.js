const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.use(authMiddleware);

router.get('/', paymentController.getPayments);
router.post('/', paymentController.processPayment);

module.exports = router;
const Payment = require('../models/Payment');

exports.getPayments = async (req, res) => {
  try {
    const payments = await Payment.find();
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener pagos', error: error.message });
  }
};

exports.processPayment = async (req, res) => {
  try {
    const { metodo, estado } = req.body;
    const payment = new Payment({
      metodo,
      estado: estado || 'exitoso'
    });
    await payment.save();
    res.status(201).json(payment);
  } catch (error) {
    res.status(500).json({ message: 'Error al procesar el pago', error: error.message });
  }
};
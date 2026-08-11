const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  metodo: {
    type: String,
    required: [true, 'El método de pago es obligatorio'],
    enum: ['tarjeta', 'paypal', 'transferencia', 'efectivo']
  },
  estado: {
    type: String,
    enum: ['exitoso', 'fallido', 'pendiente'],
    default: 'pendiente'
  },
  pedido: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Payment', paymentSchema);
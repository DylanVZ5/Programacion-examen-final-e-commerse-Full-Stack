const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  producto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  comentario: {
    type: String,
    required: [true, 'El comentario es obligatorio'],
    trim: true
  },
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Review', reviewSchema);
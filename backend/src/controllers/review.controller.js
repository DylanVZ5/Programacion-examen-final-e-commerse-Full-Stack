const Review = require('../models/Review');

exports.getReviews = async (req, res) => {
  try {
    const reviews = await Review.find().populate('producto', 'nombre');
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener reseñas', error: error.message });
  }
};

exports.createReview = async (req, res) => {
  try {
    const { producto, comentario } = req.body;
    const review = new Review({ producto, comentario });
    await review.save();
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la reseña', error: error.message });
  }
};
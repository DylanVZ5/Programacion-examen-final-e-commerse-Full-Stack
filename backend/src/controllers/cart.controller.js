const Cart = require('../models/Cart');

exports.getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ usuario: req.user.id }).populate('productos.producto');
    if (!cart) {
      cart = await Cart.create({ usuario: req.user.id, productos: [] });
    }
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el carrito', error: error.message });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const { productoId, cantidad } = req.body;
    let cart = await Cart.findOne({ usuario: req.user.id });

    if (!cart) {
      cart = new Cart({ usuario: req.user.id, productos: [] });
    }

    const itemIndex = cart.productos.findIndex(p => p.producto.toString() === productoId);
    if (itemIndex > -1) {
      cart.productos[itemIndex].cantidad += (cantidad || 1);
    } else {
      cart.productos.push({ producto: productoId, cantidad: cantidad || 1 });
    }

    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error al agregar al carrito', error: error.message });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ usuario: req.user.id });
    if (!cart) return res.status(404).json({ message: 'Carrito no encontrado' });

    cart.productos = cart.productos.filter(p => p.producto.toString() !== req.params.productoId);
    await cart.save();
    
    await cart.populate('productos.producto');
    
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error al remover del carrito', error: error.message });
  }
};

// Obtener TODOS los carritos (Solo Admin)
exports.getAllCarts = async (req, res) => {
  try {
    console.log("ADMIN: Solicitando todos los carritos de la base de datos...");
    
    // Al usar Cart.find() vacío, Mongoose ignora los usuarios y trae TODO
    const carts = await Cart.find()
      .populate('usuario', 'nombre email')
      .populate('productos.producto', 'nombre precio')
      .sort({ updatedAt: -1 });

    console.log(`ADMIN: Se encontraron ${carts.length} carritos.`);
    
    // Si todo sale bien, enviamos la respuesta para destrabar a Angular
    res.status(200).json(carts);
  } catch (error) {
    console.error('Error al obtener el historial:', error);
    // Si algo falla, enviamos el error para que Angular no se quede esperando
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
};